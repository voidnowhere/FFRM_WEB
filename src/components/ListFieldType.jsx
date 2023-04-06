import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance.js";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { Form } from "react-bootstrap";
import { Modal } from "react-bootstrap";
export default function ListFieldType (){
    const [data, setData] = useState([])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    useEffect(() => {
        axiosInstance.get('api/fieldType').then((response) => {
        setData(response.data)
        
    })

    }, [])

    const handleSubmit= event =>{
      document.getElementById("h1").innerHTML="text" ;
  }
    
    return(

      <div className="Container">
                    <Table striped bordered hover>
                      
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Max</th>
                        <th>Price</th>
                        <th>Advance</th>
                        <th><Button variant="primary" onClick={handleShow}>Add</Button></th>
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

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add FootBall Field Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form method="POST" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="NAME"
                    autoFocus
                  />

                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                  <Form.Label>Max</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MAX"
                    
                  />
                  
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="PRICE"
                    
                  />
                  
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                  <Form.Label>Advance</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ADVANCE"
                    
                  />
                  
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
            </Modal>
        </div>
        );
}