import {useEffect, useState} from "react";
import Header from "../Header.jsx";
import axiosInstance from "../../axiosInstance.js";
import AddFieldForm from "./AddFieldForm.jsx";
import {Confirm} from "notiflix/build/notiflix-confirm-aio";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import UpdateFieldForm from "./UpdateFieldForm.jsx";
import Form from "react-bootstrap/Form";
import {Button, Container, Modal} from "react-bootstrap";
import FieldsOnMap from "./FieldsOnMap.jsx";
import FieldForm from "./FieldForm.jsx";

export default function Fields() {
    const [fields, setFields] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editedField, setEditedField] = useState(null);
    const [consultField, setConsultField] = useState(null);
    const [fieldTypes, setFieldTypes] = useState(null);
    const [zones, setZones] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchSelect, setSearchSelect] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [mapModal, setMapModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [consultModal, setConsultModal] = useState(false);


    function getFields() {
        axiosInstance
            .get("api/fields/")
            .then((responseFields) => {
                setFields(responseFields.data);
               // console.log(responseFields.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getFields();
    }, []);

    useEffect(() => {
        axiosInstance
            .get("api/zones/")
            .then((responseZones) => {
                setZones(responseZones.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // console.log(zones);
    }, [zones]);

    useEffect(() => {
        axiosInstance
            .get("api/cities/")
            .then((responseCities) => {
                setCities(responseCities.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        //console.log(cities);
    }, [cities]);

    useEffect(() => {
        axiosInstance
            .get("api/field_types/")
            .then((responseFieldTypes) => {
                setFieldTypes(responseFieldTypes.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // console.log(fieldTypes);
    }, [fieldTypes]);

    /* useEffect(() => {
      axiosInstance.get("api/zones/").then((responseZones) => {
        setZones(responseZones.data);
        axiosInstance
          .get(`api/fields/${responseZones.data[0].id}/`)
          .then((responseFields) => {
            setFields(responseFields.data);
          });
      });
    }, []); */

    const handleDelete = async (fieldId) => {
        Confirm.show(
            "Delete Confirm",
            "Are you you want to delete?",
            "Delete",
            "Abort",
            async () => {
                try {
                    const response = await axiosInstance({
                        method: "delete",
                        url: `/api/fields/${fieldId}`,
                    });

                    if (response.status === 200 || response.status === 204) {
                        setFields(fields.filter((field) => field.id !== fieldId));
                        Notify.success("Field deleted successfully");
                    } else {
                        Notify.failure("Failed to delete Field");
                    }
                } catch (error) {
                    Notify.failure("Failed to delete Field");
                }
            },
            () => {
                //  console.log("If you say so...");
            },
            {}
        );
    };

    const handleEdit = (field) => {
        setEditedField(field);
        setShowModal(true);
    };
    const handleConsult = (field) => {
        setConsultField(field);
        setConsultModal(true);
    };
    const onHideModal = () => {
        setShowModal(false);
        setEditedField(null);
    };
    const onHideConsultModal = () => {
        setConsultModal(false);
        setConsultField(null);
    };
    const getFieldType = (fieldTypeId) => {
        const fieldType = fieldTypes
            ? fieldTypes.find((type) => type.id === fieldTypeId)
            : null;
        return fieldType ? fieldType.name : "";
    };

    const getFieldZone = (getZoneId) => {
        const fieldZone = zones
            ? zones.find((zone) => zone.id === getZoneId)
            : null;
        return fieldZone ? fieldZone.name : "";
    };
    const handleAddClose = () => setShowAddModal(false);
    const handleAddShow = () => setShowAddModal(true);

    const updateField = (updateField) => {
        const updatedfields = fields.map((field) =>
            field.id === updateField.id ? updateField : field
        );
        setFields(updatedfields);
    };

    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
        const filterFunction = (field) => {
            switch (searchSelect) {
                case "1":
                    return field.name.toLowerCase().includes(searchValue.toLowerCase());
                case "2":
                    return field.address
                        .toLowerCase()
                        .includes(searchValue.toLowerCase());
                case "3":
                    const nomZone = getFieldZone(field.zone);
                    return nomZone.toLowerCase().includes(searchValue.toLowerCase());

                default:
                    return true;
            }
        };


        setFilteredResults(fields.filter(filterFunction));
    };

    const renderField = (field) => {
        return (
            <tr key={field?.id}>
                <td>{field?.name}</td>
                <td>{field?.address}</td>

                <td>{getFieldZone(field?.zone)}</td>

                <td>
                    <button
                        className="btn btn-warning"
                        onClick={() => handleConsult(field)}
                    >
                        Consult
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(field)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(field?.id)}
                    >
                        Delete
                    </button>

                </td>
            </tr>
        );
    };

    return (
        <>
            <Header/>
            <Container className='my-3'>
                <h1>List of Fields</h1>
                <div className='my-2'>
                    <button className="btn btn-primary" onClick={handleAddShow}>
                        Add Field
                    </button>
                    <span> </span>
                    <button className="btn btn-secondary" onClick={() => setMapModal(true)}>
                        Fields On Map
                    </button>
                </div>
                <div className='my-2'>
                    <Form className="d-flex">
                        <Form.Select
                            style={{width: "120px"}}
                            size="sm"
                            onChange={(e) => {
                                setSearchSelect(e.target.value);
                            }}
                        >
                            <option>Search by:</option>
                            <option key="searchSelect1" value="1">
                                Name
                            </option>
                            <option key="searchSelect2" value="2">
                                Address
                            </option>
                            <option key="searchSelect3" value="3">
                                Zone
                            </option>
                        </Form.Select>
                        <Form.Control
                            type="search"
                            placeholder="Search Bar"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => searchItems(e.target.value)}
                        />
                    </Form>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Zone</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchInput.length > 2
                        ? filteredResults.map((field) => renderField(field))
                        : fields.map((field) => renderField(field))}
                    </tbody>
                </table>
                <AddFieldForm
                    getFields={getFields}
                    fieldTypes={fieldTypes}
                    cities={cities}
                    zones={zones}
                    show={showAddModal}
                    handleClose={handleAddClose}
                />
                {editedField && (
                    <UpdateFieldForm
                        updateField={updateField}
                        showModal={showModal}
                        onHide={onHideModal}
                        field={editedField}
                        cities={cities}
                    />
                )}
                {consultField && (
                    <FieldForm
                        showModal={consultModal}
                        onHide={onHideConsultModal}
                        field={consultField}
                        getFieldZone={getFieldZone}
                        getFieldType={getFieldType}
                    />
                )}

                <Modal
                    show={mapModal}
                    onHide={() => {
                        setMapModal(false);
                    }}
                    size="xl"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Fields On Map
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FieldsOnMap/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setMapModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}
