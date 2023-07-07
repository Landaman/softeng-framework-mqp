import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ComputerRequest } from "database";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Table } from "react-bootstrap";

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
    };

    // Catch and print any errors
    fun().catch((error) => console.error(error));
  }, [getAccessTokenSilently]);

  // Set up the columns for the computer request
  const columnHelper = createColumnHelper<ComputerRequest>();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("location", {
      header: "Location",
    }),
    columnHelper.accessor("staff", {
      header: "Staff",
    }),
    columnHelper.accessor("reason", {
      header: "Reason",
    }),
    columnHelper.accessor("type", {
      header: "Type",
    }),
  ];

  // Generate the actual table
  const table = useReactTable({
    data: requests,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
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
