import React, { useState, useEffect } from "react";
import Header from "../Header.jsx";
import axiosInstance from "../../axiosInstance.js";
import AddFieldForm from "./AddFieldForm.jsx";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import UpdateFieldForm from "./UpdateFieldForm.jsx";
import Form from "react-bootstrap/Form";
import { Container} from 'react-bootstrap';
export default function Fields() {
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editedField, setEditedField] = useState(null);
  const [fieldTypes, setFieldTypes] = useState(null);
  const [zones, setZones] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const [cities, setCities] = useState([]);

  const soilTypeOptions = [
    { value: "synthetique", label: "Synthetique" },
    { value: "naturelle", label: "Naturelle" },
  ];

  useEffect(() => {
    axiosInstance
      .get("api/fields/")
      .then((responsefields) => {
        setFields(responsefields.data);
        // console.log(responsefields.data);
      })
      .catch((error) => {
        console.error(error);
      });
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
            method: 'delete',
            url: `/api/fields/${fieldId}`,
        
          })

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
  const onHideModal = () => {
    setShowModal(false);
    setEditedField(null);
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

  const handleAddfield = (newField) => {
    // add new field to list of fields
    setFields([...fields, newField]);
  };
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
          const nomZone=getFieldZone(field.id);
          return nomZone.toLowerCase().includes(searchValue.toLowerCase());
    
        default:
          return true;
      }
    };
    setFilteredResults(fields.filter(filterFunction));
  };

  const renderField = (field) => {
    return (
      <tbody>
        <tr key={field?.id}>
          <td>{field?.name}</td>
          <td>{field?.address}</td>
          <td>{field?.latitude}</td>
          <td>{field?.longitude}</td>
          <td>{field?.description}</td>
          <td>{getFieldType(field?.type)}</td>
          <td>{getFieldZone(field?.zone)}</td>
          <td>{field.soil_type}</td>

          <td>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(field?.id)}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleEdit(field)}
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    );
  };

  return (
   <>
      <Header />
      <Container>
      <div className="fields-container"></div>

      <h1>List of Fields</h1>
      <button className="btn btn-primary" onClick={handleAddShow}>
        Add Field
      </button>
      <br />

      <br />
      <Form className="d-flex">
        <Form.Select
          style={{ width: "120px" }}
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
          placeholder="Search for fields"
          className="me-2"
          aria-label="Search"
          onChange={(e) => searchItems(e.target.value)}
        />
      </Form>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Laltitude</th>
            <th>Longitude</th>
            <th>Description</th>
            <th>Field Type</th>
            <th>Zone</th>
            <th>Soil Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        {searchInput.length > 2
          ? filteredResults.map((field) => renderField(field))
          : fields.map((field) => renderField(field))}
      </table>
      <AddFieldForm
        onAddField={handleAddfield}
        fieldTypes={fieldTypes}
        cities={cities}
        zones={zones}
        show={showAddModal}
        handleClose={handleAddClose}
      />
      {editedField && (
        <UpdateFieldForm
          showModal={showModal}
          onHide={onHideModal}
          field={editedField}
          cities={cities}
          updateField={updateField}
        />
      )}
    </Container>
    </>
  );
}
