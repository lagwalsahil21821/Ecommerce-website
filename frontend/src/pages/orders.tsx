import TableHOC from "../components/admin/TableHOC";
import {ReactElement, useState} from 'react';
import { Link } from "react-router-dom";
import { Column } from "react-table"; 

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}

const column : Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Action",
        accessor: "action",
    }
]

const Orders = () => {
    const [rows] = useState<DataType[]>([
        {
            _id: "kjfdk",
            amount: 332432,
            quantity: 32,
            discount: 2131,
            status: <span className="red">Processing</span>,
            action: <Link to={`/orders/kjfdk`} >View</Link>,
        },
    ])
    const tables = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();
    return (
        <div className="container">
            <h1>My orders</h1>
            {tables}
        </div>
    )
}

export default Orders