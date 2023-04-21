import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance.js";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Container, Form, Modal} from "react-bootstrap";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import Header from "./Header.jsx";
import {Confirm} from "notiflix";

export default function ListFieldType(props) {
  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [max, setMax] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [id, setId] = useState("");

  const [showPost, setShowPost] = useState(false);
  const handleClosePost = () => setShowPost(false);
  const handleShowPost = () => setShowPost(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (e) => {
    setShowEdit(true);
    const dataValue = e.target.value;
    {
      data.map((data, i) =>
        data.id == dataValue
          ? (setName(data.name),
            setMax(data.max),
            setPriceHour(data.priceHour),
            setId(dataValue))
          : null
      );
    }
  };

  useEffect(() => {
    axiosInstance.get("api/field_types/").then((response) => {
      setData(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axiosInstance
      .post("api/field_types/", {
        name: name,
        max: max,
        priceHour: priceHour,
      })
      .then(() => {
        Notify.success("successfully added ", {
          position: "center-bottom",
        });

        axiosInstance.get("api/field_types/").then((response) => {
          setData(response.data);
        });
      });

    setShowPost(false);
    setName("");
    setMax("");
    setPriceHour("");
  };

  const handlePut = (event) => {
    event.preventDefault();
    axiosInstance
      .put("api/field_types/" + id + "/", {
        name: name,
        max: max,
        priceHour: priceHour,
      })
      .then(() => {
        Notify.success("successfully edited ", {
          position: "center-bottom",
        });

        axiosInstance.get("api/field_types/").then((response) => {
          setData(response.data);
        });
      });

    setShowEdit(false);
    setName("");
    setMax("");
    setPriceHour("");
  };

  const handleDelete = (id) => {
    Confirm.show(
      "Confirm",
      "Do you want to delete this field type?",
      "Yes",
      "No",
      () => {
        axiosInstance.delete("api/field_types/" + id + "/").then(() => {
          Notify.success("successfully deleted ", {
            position: "center-bottom",
          });

          axiosInstance.get("api/field_types/").then((response) => {
            setData(response.data);
          });
        });
      }
    );
  };

  return (
    <>
      <Header />
      <Container className="mt-5">
        <h3>Field types</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Max</th>
              <th>Price Hour</th>
              <th>
                <Button variant="primary" size="sm" onClick={handleShowPost}>
                  Add
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((data, i) => (
              <tr key={i}>
                <td>{data.name}</td>
                <td>{data.max}</td>
                <td>{data.priceHour}</td>
                <td>
                  <Button
                    value={data.id}
                    size="sm"
                    variant="success"
                    onClick={handleShowEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    className="ms-2"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showPost} onHide={handleClosePost}>
          <Modal.Header closeButton>
            <Modal.Title>Add FootBall Field Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form method="POST" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  id="inputNAME"
                  type="text"
                  placeholder="NAME"
                  value={name}
                  onChange={(e) => setName(event.target.value)}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Max</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MAX"
                  value={max}
                  onChange={(e) => setMax(event.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="PRICE Hour"
                  value={priceHour}
                  onChange={(e) => setPriceHour(event.target.value)}
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClosePost}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
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
            <Form method="PUT" onSubmit={handlePut}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="NAME"
                  value={name}
                  onChange={(e) => setName(event.target.value)}
                  autoFocus
                  id="inputNameEdit"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Max</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MAX"
                  value={max}
                  onChange={(e) => setMax(event.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="PRICE Hour"
                  value={priceHour}
                  onChange={(e) => setPriceHour(event.target.value)}
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Edit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
