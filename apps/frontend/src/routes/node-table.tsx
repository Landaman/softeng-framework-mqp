import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Form from "react-bootstrap/Form";
import { Table } from "react-bootstrap";
import NodeDao, { Node, UpdateNode } from "../database/node-dao.ts";

// Update the table meta and column metas, so that we can provide additional information to the table and columns
declare module "@tanstack/react-table" {
  // This next disable is REQUIRED, or we will have linting issues.
  // It's because TData is required (as we are extending
  // the base interface), but we don't use it in our TableMeta.
  // The same applies for ColumnMeta below
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, updateParameter: unknown) => Promise<void>;
  }

  // See above for justification on the following eslint-disable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    isEditable: boolean;
    createUpdateArgs: (originalID: number, value: TValue) => unknown;
  }
}

/**
 * Override the default column renderer, allow it to create cells that are editable text boxes
 */
const defaultColumn: Partial<ColumnDef<Node>> = {
  cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = async () => {
      await table.options.meta?.updateData(
        index,
        table
          .getColumn(id)
          ?.columnDef.meta?.createUpdateArgs(
            table.getRow(index.toString()).original.id,
            value
          )
      );
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return table.getColumn(id)?.columnDef.meta?.isEditable ? (
      <Form.Control
        size="sm"
        className="border-0 p-0 bg-transparent"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          // Nice QOL feature that removes the "blur" focus when Enter is pressed
          if (e.code === "Enter") {
            e.preventDefault(); // Prevents this from going to the input, doesn't really matter
            e.currentTarget.blur(); // Blur out the input
          }
        }}
      />
    ) : (
      value
    );
  },
};

/**
 * Component for the computer service request viewing table
 */
export default function ComputerRequestTable() {
  const { getAccessTokenSilently } = useAuth0();

  // The computer requests list
  const [requests, setRequests] = useState<Node[]>([]);

  // This gets the requests from the API
  useEffect(() => {
    // This trick lets us use an async function in useEffect
    const fun = async () => {
      const requestDao = new NodeDao();
      // Get the requests from the API
      const requests = await requestDao.getAll(await getAccessTokenSilently());

      // Set the requests
      setRequests(requests);
    };

    // Let the error fall through, it will be handled by react router
    fun();
  }, [getAccessTokenSilently]);

  // Set up the columns for the computer request
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Node>();
    return [
      columnHelper.accessor("id", {
        header: "ID",
        meta: {
          // Disable editing, and do not support ID changing
          isEditable: false,
          createUpdateArgs: () => {
            throw "Changing IDs is not supported";
          },
        },
      }),
      columnHelper.accessor("xCoord", {
        header: "xCoord",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              xCoord: value,
            } satisfies UpdateNode;
          },
        },
      }),
      columnHelper.accessor("yCoord", {
        header: "yCoord",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              yCoord: value,
            } satisfies UpdateNode;
          },
        },
      }),
      columnHelper.accessor("floor", {
        header: "floor",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              floor: value,
            } satisfies UpdateNode;
          },
        },
      }),
      columnHelper.accessor("building", {
        header: "building",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              building: value,
            } satisfies UpdateNode;
          },
        },
      }),
      columnHelper.accessor("locationName.longName", {
        header: "Related Locations",
        meta: {
          isEditable: false,
          createUpdateArgs: () => {
            throw "Changing Locations is not supported";
          },
        },
      }),
    ];
  }, []);

  // Generate the actual table
  const table = useReactTable({
    data: requests,
    columns: columns,
    defaultColumn: defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "id",
          desc: false,
        },
      ],
    },
    meta: {
      updateData: async (rowIndex: number, updateParams: unknown) => {
        // Get the DAO to do the update with
        const dao = new NodeDao();

        // Do the update, get the new request
        const newRequest = await dao.update(
          await getAccessTokenSilently(),
          updateParams as UpdateNode
        );

        // Go through the requests, replace only the new request to be the data
        setRequests(
          requests.map((request, index) => {
            if (index !== rowIndex) {
              return request;
            } else {
              return newRequest;
            }
          })
        );
      },
    },
  });

  return (
    <Table bordered responsive hover>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
