import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance.js";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Header from "./Header"

export default function ListFieldTypeById() {
    const [data, setData] = useState([])
   
    useEffect(() => {
        axiosInstance.get('api/fieldType/1').then((response) => {
        setData([response.data])

    })

    }, [])

    const handleClickAdd = event =>{
        document.getElementById("h1").innerHTML="text" ;
    }

    return(
    <div className="Container">
       
        <Header/>
                    <div className="table" style={{padding : "100px"}}>

                    
                    <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Max</th>
                        <th>Price</th>
                        <th>Advance</th>
                        <th><Button variant="primary" onClick={handleClickAdd}>Add</Button></th>
                    </tr>
                    </thead>
                    <tbody>
                        {data.map((data , i) => (
                                <tr key={i}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.max}</td>
                                <td>{data.price}</td>
                                <td>{data.advance}</td>
                                <td><Button variant="success">Edit</Button><Button variant="danger">Delete</Button></td>
                            </tr>
                        ))}
                    
                    
                    </tbody>
                </Table>
                </div>
    </div>
        );
}