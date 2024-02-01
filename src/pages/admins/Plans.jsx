

import { Link } from "react-router-dom";
import { useTotal, useData } from "functions/reads/General";
import { updateAllDocs } from "functions/updates/General";
import { getPast7Days, getHumanReadableDateDifference, readableDate } from "functions/utils/Fixers";
import { Btn, EmptyBox } from "components";
import { serverTimestamp } from "firebase/firestore";

import { LineChart } from '@mui/x-charts/LineChart';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import StatCards from "./dashboard/StatCards";


function createData(
  name,
  calories,
  fat,
  carbs,
  protein,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];


export default function() {

    const { data, isLoading, isError } = useData({target: "Plans", conditions: []});


    return (
        <section>

            <div className="flex items-center justify-between mb-3">
                <h1 className="orb font-semibold">Plans</h1>

                <Link to="/admin/plan/new">
                    <Btn.SmallBtn>New Plan</Btn.SmallBtn>
                </Link>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Job Limit</TableCell>
                        <TableCell>Application Limit</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {typeof(data) != 'undefined' && 
                        data[0]?.map((row) => (
                            <TableRow
                            key={row.Name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell>
                                {row.Name}
                            </TableCell>
                            <TableCell>Ghc {row.Amount}</TableCell>
                            <TableCell> {row["Default Rating"] > 0 ? row["Default Rating"] : " No "} {row["Default Rating"] > 1 ? "Stars" : "Star"}</TableCell>
                            <TableCell>{row.Jobs} Job{row.Jobs > 1 ? "s" : ""} / week </TableCell>
                            <TableCell>{row.Applications} Application{row.Jobs > 1 ? "s" : ""} / day </TableCell>
                            <TableCell>{readableDate(row["Upload Timestamp"])}</TableCell>
                            <TableCell>
                                <Link to={`/admin/plan/edit/${row.id}`}>
                                    <Btn.SmallBtn>View Details</Btn.SmallBtn>
                                </Link>
                            </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>

            <EmptyBox load={typeof(data) != 'undefined' && data[0]?.length <= 0} title="No Plans Yet" text=""/>

        </section>
    );
}