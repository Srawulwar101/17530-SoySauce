import React, { useState } from "react";
import { checkoutResource, checkinResource } from "../../services/api";

const Resource = () => {
  const [resourceId, setResourceId] = useState("");
  const [units, setUnits] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle checkout of a resource
  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const response = await checkoutResource(resourceId, units);
      setMessage(response.data.message);
      setResourceId(""); // Clear input fields
      setUnits("");
    } catch (error) {
      setMessage("Failed to check out resource.");
    }
  };

  // Function to handle checkin of a resource
  const handleCheckin = async (e) => {
    e.preventDefault();
    try {
      const response = await checkinResource(resourceId, units);
      setMessage(response.data.message);
      setResourceId(""); // Clear input fields
      setUnits("");
    } catch (error) {
      setMessage("Failed to check in resource.");
    }
  };

  return (
    <div>
      <h2>Manage Resources</h2>
      <form onSubmit={handleCheckout}>
        <input
          type="text"
          placeholder="Resource ID"
          value={resourceId}
          onChange={(e) => setResourceId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Units"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />
        <button type="submit">Check Out Resource</button>
      </form>

      <form onSubmit={handleCheckin}>
        <input
          type="text"
          placeholder="Resource ID"
          value={resourceId}
          onChange={(e) => setResourceId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Units"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />
        <button type="submit">Check In Resource</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default Resource;
