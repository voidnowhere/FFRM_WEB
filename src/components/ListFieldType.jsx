import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance.js";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { Form } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {Notify} from "notiflix/build/notiflix-notify-aio";


export default function ListFieldType (props){

  const [data, setData] = useState([])
  
  const [name, setName] = useState('');
  const [max, setMax] = useState('');
  const [priceHour, setPriceHour] = useState('');
  const [id, setId] = useState('')
        
  const [showPost, setShowPost] = useState(false);
  const handleClosePost = () => setShowPost(false);
  const handleShowPost = () => setShowPost(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (e) => {
    setShowEdit(true);
    const dataValue = e.target.value;
    {data.map((data , i) => (
     data.id == dataValue ? (setName(data.name),setMax(data.max), setPriceHour(data.priceHour), setId(dataValue)):null
))}
  }

  

  useEffect(() => {
      axiosInstance.get('api/fieldType').then((response) => {
      setData(response.data); 
  })

  }, [])

  
        const handleSubmit = event =>{
          event.preventDefault();
          axiosInstance.post('api/fieldType', {
              name: name,
              max: max,
              priceHour: priceHour
             
          }).then(() => {
            Notify.success("successfully added ", {
              'position': "center-bottom",
          });
          
            axiosInstance.get('api/fieldType').then((response) => {
              setData(response.data); })
          });
    
          
        setShowPost(false)
        setName("")
        setMax("")
        setPriceHour("")
      }


      const handlePut = event =>{
        event.preventDefault();
        axiosInstance.put('api/fieldType/'+id, {
            name: name,
            max: max,
            priceHour: priceHour
           
        }).then(() => {
          Notify.success("successfully edited ", {
            'position': "center-bottom",
        });
        
          axiosInstance.get('api/fieldType').then((response) => {
            setData(response.data); })
        });
  
        
      setShowEdit(false)
      setName("")
      setMax("")
      setPriceHour("")
    }

    const handleDelete = event =>{
      setId(event.target.value)
      axiosInstance.delete('api/fieldType/'+id) 
         .then(() => {
        Notify.success("successfully deleted ", {
          'position': "center-bottom",
      });
      
        axiosInstance.get('api/fieldType').then((response) => {
          setData(response.data); })
      });

  }


      
return(
     
    <div className="Container">
     
     
    <Table striped bordered hover>
      
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Max</th>
        <th>Price Hour</th>
        <th><Button variant="primary" onClick={handleShowPost}>Add</Button></th>
      </tr>
    </thead>
    <tbody>
        {data.map((data , i) => (
                <tr key={i}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.max}</td>
                <td>{data.priceHour}</td>
                <td ><Button value={data.id} variant="success" onClick={handleShowEdit}>Edit</Button><Button variant="danger" value={data.id} onClick={handleDelete}>Delete</Button></td>
            </tr>
        ))}
      
    
    </tbody>
  </Table>


<Modal show={showPost} onHide={handleClosePost}>
<Modal.Header closeButton>
<Modal.Title>Add FootBall Field Type</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form  method="POST" onSubmit={(handleSubmit)}>
<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
  <Form.Label>Name</Form.Label>
  <Form.Control id="inputNAME"
    type="text"
    placeholder="NAME"
    value={name}
   onChange={(e) =>setName(event.target.value)}
    autoFocus
    
  />

</Form.Group>

<Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
  <Form.Label>Max</Form.Label>
  <Form.Control
    type="text"
    placeholder="MAX"
    value={max}
    onChange={(e) =>setMax(event.target.value)}
    
  />
  
</Form.Group>

<Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
  <Form.Label>Price</Form.Label>
  <Form.Control
    type="text"
    placeholder="PRICE Hour"
    value={priceHour}
    onChange={(e) =>setPriceHour(event.target.value)}
  />
  
</Form.Group>


<Modal.Footer>
<Button variant="secondary" onClick={handleClosePost}>
Cancel
</Button>
<Button variant="primary" type="submit" >
Add
</Button>
</Modal.Footer>
</Form>
</Modal.Body>
</Modal>





<Modal show={showEdit} onHide={handleCloseEdit}>
<Modal.Header closeButton>
<Modal.Title>Edit FootBall Field Type</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form  method="PUT" onSubmit={(handlePut)}>
<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
  <Form.Label>Name</Form.Label>
  <Form.Control 
    type="text"
    placeholder="NAME"
   value={name}
   onChange={(e) =>setName(event.target.value)}
    autoFocus
    id="inputNameEdit"
  />

</Form.Group>

<Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
  <Form.Label>Max</Form.Label>
  <Form.Control
    type="text"
    placeholder="MAX"
    value={max}
    onChange={(e) =>setMax(event.target.value)}
    
  />
  
</Form.Group>

<Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
  <Form.Label>Price</Form.Label>
  <Form.Control
    type="text"
    placeholder="PRICE Hour"
    value={priceHour}
    onChange={(e) =>setPriceHour(event.target.value)}
  />
  
</Form.Group>


<Modal.Footer>
<Button variant="secondary" onClick={handleCloseEdit}>
Cancel
</Button>
<Button variant="primary" type="submit" >
Edit
</Button>
</Modal.Footer>
</Form>
</Modal.Body>
</Modal>
    </div>
);

}