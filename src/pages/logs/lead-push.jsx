import { PencilIcon } from "@heroicons/react/24/solid";
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Input,
} from "@material-tailwind/react";
import Track from "@/components/Logs/Track";
import { useEffect, useState } from "react";
import axios from "axios";
import { GET_LEAD_PUSH_LOGS, GET_LEAD_WISE_LEAD_PUSH_LOGS } from "@/utils/ApiRoutes";
import Datepicker from "react-tailwindcss-datepicker";

const TABLE_HEAD = ["Id",  "PartnerName", "Success", "Failure", "Pending", "Reject", "Total Count"];

export default function Logs() {
    const [logs, setLogs] = useState([])
    const [totalPages, setTotalPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0)
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const pageSize = 20;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRows = logs.slice(startIndex, endIndex);

    useEffect(() => {

        axios.post(GET_LEAD_PUSH_LOGS, { dateRange }).then((res) => {
            setLogs(res.data.logs)
            setTotalLeads(res.data.count)
            const calculatedTotalPages = Math.ceil(res.data.logs.length / pageSize);
            setTotalPages(calculatedTotalPages);
        })

    }, [currentPage, dateRange])

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const handleSearch = (event) => {

        setSearchTerm(event.target.value);
    };


    const filteredRows = logs.filter(row =>

        (row.partnerName.CampaignName && row.partnerName.CampaignName.toLowerCase().includes(searchTerm.toLowerCase()))

    );

    const handleValueChange = (newValue) => {
        setDateRange(newValue);
    }



    return (

        <Card className="h-full w-full">

            <div className="rounded-none p-5" >
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Logs
                        </Typography>
                    </div>

                </div>


                <div className='flex justify-between'>

                    <div className='w-1/2  border-[1px] rounded-md border-gray-500  '>

                        <Datepicker
                            value={dateRange}
                            onChange={handleValueChange}
                            showShortcuts={true}
                            border={true}

                        />

                    </div>

                    {/* <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="w-full md:w-72">
                            <Input
                                label="Search"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                onChange={handleSearch}
                            />
                        </div>

                    </div> */}
                    
                </div>

            </div>

            <CardBody className="overflow-scroll px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className=" ">
                        
                            {filteredRows.length > 0 && logs.map(({ partnerId, partnerName, successCount, failureCount, pendingCount, rejectCount }, index) => {
                                const isLast = index === paginatedRows.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                return (
                                    <tr key={index}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {partnerId}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {partnerName.CampaignName}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {successCount}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {failureCount}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {pendingCount}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {rejectCount}
                                            </Typography>
                                        </td>

                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {successCount + failureCount + pendingCount + rejectCount}
                                            </Typography>
                                        </td>
                                       
                                    </tr>
                                );
                            })}
                       

                    </tbody>
                </table>
            </CardBody>


            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        if (
                            (page >= currentPage - 2 && page <= currentPage + 2) ||
                            page === 1 ||
                            page === totalPages
                        ) {
                            if (page === 1) {
                                return (
                                    <IconButton
                                        key={page}
                                        variant={currentPage === page ? "outlined" : "text"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </IconButton>
                                );
                            }
                            if (page === currentPage - 2 && currentPage > 4) {
                                return (
                                    <IconButton key={page} variant="text" size="sm" disabled>
                                        ...
                                    </IconButton>
                                );
                            }
                            if (page >= currentPage - 2 && page <= currentPage + 2) {
                                return (
                                    <IconButton
                                        key={page}
                                        variant={currentPage === page ? "outlined" : "text"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </IconButton>
                                );
                            }
                            if (page === currentPage + 2 && currentPage < totalPages - 3) {
                                return (
                                    <IconButton key={page} variant="text" size="sm" disabled>
                                        ...
                                    </IconButton>
                                );
                            }
                            if (page === totalPages) {
                                return (
                                    <IconButton
                                        key={page}
                                        variant={currentPage === page ? "outlined" : "text"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </IconButton>
                                );
                            }
                        }
                        return null;
                    })}
                </div>
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </CardFooter>


        </Card>
    );
}