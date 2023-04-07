import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "./Header.jsx";
import axiosInstance from "../axiosInstance.js";
import AddFieldForm from "./AddFieldForm.jsx";

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [deletemodalIsOpen, setDeletemodalIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletedField, setDeletedField] = useState(null);
  const [editedField, setEditedField] = useState(null);
  const [fieldTypes, setFieldTypes] = useState(null);
  const [zones, setZones] = useState([]);
  const soilTypeOptions = [    { value: "synthetique", label: "Synthetique" },    { value: "naturelle", label: "Naturelle" },  ];
  useEffect(() => {
    const fetchFields = async () => {
      const result = await axiosInstance.get("api/fields/all/");
      setFields(result.data);
    };
    fetchFields();
  }, []);

  useEffect(() => {
    const fetchfieldTypes = async () => {
      const result = await axiosInstance.get("api/fields/types/");
      setFieldTypes(result.data);
    };
    fetchfieldTypes();
  }, []);

  useEffect(() => {
    const fetchZones = async () => {
      const result = await axiosInstance.get("api/fields/zones/");
      setZones(result.data);
    };
    fetchZones();
  }, []);

  const deleteOpenModal = (fieldId) => {
    setDeletedField(fieldId);
    setDeletemodalIsOpen(true);
  };
  const handleEdit = (field) => {
    setEditedField(field);
    setShowModal(true);
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
  return (
    <>
      <Header />

      <div className="fields-container"></div>

      <h1>List of Fields</h1>
      <button className="btn btn-primary" onClick={handleAddShow}>
        Add Field
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Altitude</th>
            <th>Longitude</th>
            <th>Description</th>
            <th>Type</th>
            <th>Zone</th>
            <th>soil type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td>{field.id}</td>
              <td>{field.name}</td>
              <td>{field.address}</td>
              <td>{field.laltitude}</td>
              <td>{field.longitude}</td>
              <td>{field.description}</td>
              <td>{getFieldType(field.type)}</td>
              <td>{getFieldZone(field.zone)}</td>

              <td>{field.soil_type}</td>

              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteOpenModal(field.id)}
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
          ))}
        </tbody>
      </table>
      <AddFieldForm
        fieldTypes={fieldTypes}
        zones={zones}
        show={showAddModal}
        handleClose={handleAddClose}
      />
    </>
  );
}
