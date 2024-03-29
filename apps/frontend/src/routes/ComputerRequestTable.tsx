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
import ComputerRequestDao, {
  ComputerRequest,
  UpdateComputerRequest,
} from "../database/computer-request-dao.ts";

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
const defaultColumn: Partial<ColumnDef<ComputerRequest>> = {
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
  const [requests, setRequests] = useState<ComputerRequest[]>([]);

  // This gets the requests from the API
  useEffect(() => {
    // This trick lets us use an async function in useEffect
    const fun = async () => {
      const requestDao = new ComputerRequestDao();
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
    const columnHelper = createColumnHelper<ComputerRequest>();
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
      columnHelper.accessor("location", {
        header: "Location",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              location: value,
            } satisfies UpdateComputerRequest;
          },
        },
      }),
      columnHelper.accessor("staff", {
        header: "Staff",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              staff: value,
            } satisfies UpdateComputerRequest;
          },
        },
      }),
      columnHelper.accessor("reason", {
        header: "Reason",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              reason: value,
            } satisfies UpdateComputerRequest;
          },
        },
      }),
      columnHelper.accessor("type", {
        header: "Type",
        meta: {
          isEditable: true,
          createUpdateArgs: (id, value) => {
            return {
              id: id,
              type: value,
            } satisfies UpdateComputerRequest;
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
        const dao = new ComputerRequestDao();

        // Do the update, get the new request
        const newRequest = await dao.update(
          await getAccessTokenSilently(),
          updateParams as UpdateComputerRequest
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
    <>
      <span
        className={"heading-text"}
        style={{ marginTop: "32px", marginBottom: "16px" }}
      >
        Computer Requests
      </span>
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
    </>
  );
}
