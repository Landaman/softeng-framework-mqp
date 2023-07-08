import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { ComputerRequest } from "database";
import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { Table } from "react-bootstrap";
import { Prisma } from "database";

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
    createUpdateArgs: (value: TValue) => unknown;
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
        table.getColumn(id)?.columnDef.meta?.createUpdateArgs(value)
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

  const [isLoading, setLoading] = useState(true);

  // This gets the requests from the API
  useEffect(() => {
    // This trick lets us use an async function in useEffect
    const fun = async () => {
      // Start loading
      setLoading(true);

      // Get the requests from the API
      const requests = await axios.get<ComputerRequest[]>(
        "/api/computer-requests",
        {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        }
      );

      // Set the requests
      setRequests(requests.data);

      // Stop the loading
      setLoading(false);
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
          createUpdateArgs: (value) => {
            return {
              location: value,
            } satisfies Prisma.ComputerRequestUpdateInput;
          },
        },
      }),
      columnHelper.accessor("staff", {
        header: "Staff",
        meta: {
          isEditable: true,
          createUpdateArgs: (value) => {
            return {
              staff: value,
            } satisfies Prisma.ComputerRequestUpdateInput;
          },
        },
      }),
      columnHelper.accessor("reason", {
        header: "Reason",
        meta: {
          isEditable: true,
          createUpdateArgs: (value) => {
            return {
              reason: value,
            } satisfies Prisma.ComputerRequestUpdateInput;
          },
        },
      }),
      columnHelper.accessor("type", {
        header: "Type",
        meta: {
          isEditable: true,
          createUpdateArgs: (value) => {
            return {
              type: value,
            } satisfies Prisma.ComputerRequestUpdateInput;
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
    meta: {
      updateData: async (rowIndex, updateParams: unknown) => {
        // Enable loading
        setLoading(true);

        // We need to cast the update params to be the computer request create input, as that
        // is what we actually want to send to the API via axios
        const updateInput = updateParams as Prisma.ComputerRequestCreateInput;

        // Do the request, patch the request and get back the updated service request
        const newRequest = await axios.patch<ComputerRequest>(
          "/api/computer-requests/" +
            table.getRow(rowIndex.toString())?.original.id,
          updateInput,
          {
            headers: {
              Authorization: `Bearer ${await getAccessTokenSilently()}`,
            },
          }
        );

        // Go through the requests, replace only the new request to be the data
        setRequests(
          requests.map((request, index) => {
            if (index !== rowIndex) {
              return request;
            } else {
              return newRequest.data;
            }
          })
        );

        // Now that we're done, disable loading
        setLoading(false);
      },
    },
  });

  return isLoading ? (
    <div className="w-100 h-100 d-flex justify-content-center p-lg-4">
      <Spinner></Spinner>
    </div>
  ) : (
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
