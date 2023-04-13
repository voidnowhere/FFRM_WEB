import { FloatingLabel } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function FilterFields(props) {
  function onFilterValueChanged(event) {
    //console.log(event.target.value);
    props.filterValueSelected(event.target.value);
  }

  return (
    <div>
      <FloatingLabel controlId="floatingSelect" label="Filter fields by zone">
        <Form.Select
          id="selectedZone"
          value={props.selectedZone}
          aria-label="Floating label select example"
          size="sm"
          onChange={onFilterValueChanged}
        >
          {" "}
          <option value="">All Zones</option>
          {props.zones &&
            props.zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
        </Form.Select>
      </FloatingLabel>
    </div>
  );
}
