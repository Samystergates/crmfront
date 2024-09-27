import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useState } from "react";
import { getCurrentUserDetail, isLoggedIn } from "../auth";
import Draggable from "react-draggable";
import ToevKleur from "./ToevKleur";
import ToevLabel from "./ToevLabel";
import {deleteSticker} from "../services/sticker-service";
function ZoekLabel({ stickers, zLPanelModal, toggleZLFlowMod ,loadAllOrdersStickers}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(null);
  const [tLPanelModalSave, setTLPanelModalSave] = useState(false);
  const [tLPanelModalUpdate, setTLPanelModalUpdate] = useState(false);
  const [labelProduct, setLabelProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    setUser(getCurrentUserDetail());
    setLogin(isLoggedIn());
  }, []);

  const toggleTLFlowModSave = () => {
    setTLPanelModalSave(!tLPanelModalSave);
  };

  const toggleTLFlowModUpdate = () => {
    setTLPanelModalUpdate(!tLPanelModalUpdate);
  };
  const distinctProducts = Array.from(
    new Set(stickers.map((item) => item.product))
  );
  const filteredAndSortedLabel = stickers
    .filter((item) => (selectedProduct ? item.product === selectedProduct : true))
    .sort((a, b) => (a.product === selectedProduct ? -1 : 1));
  
  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const toggle = (val) => {
    if (user.departmentsSet[0].depName === "ADMIN") {
      setModal(!modal);
      if (val === "yes") {
        toggleTLFlowMoRemove();
      } else if (val === "no") {
      }
    } else {
      toast.error("UnAuthorized Department");
    }
  };

  const toggleTLFlowMoRemove = () => {
    deleteSticker(selectedRowId)
      .then((data) => {
        loadAllOrdersStickers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  };

  const thStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ccc",
  };

  const hoveredRowStyle = {
    backgroundColor: "lightblue",
    cursor: "pointer",
  };

  return (
    <>
      <Modal
        isOpen={zLPanelModal}
        toggle={toggleZLFlowMod}
        fullscreen
        unmountOnClose
        backdrop="static"
        style={{
          maxWidth: "50%",
          maxHeight: "70%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: "25%",
          top: "15%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader toggle={toggleZLFlowMod}>
          <strong>Zoek Label gegevens</strong>
        </ModalHeader>
        <ModalBody>
          <div className="col-md-4" style={{}}>
            <div>
              <label htmlFor="searchField"></label>
              <select
                style={{
                  width: "50%",
                  border: "3px solid #ccc",
                  outline: "none",
                  background: "white",
                  padding: "5px",
                  borderRadius: "3px",
                }}
                value={selectedProduct}
                onChange={handleProductChange}
              >
                <option value="">Selecteer Label</option>
                 {distinctProducts.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))} 
              </select>
            </div>
          </div>
          <hr style={{ margin: "1rem 0" }} />
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Barcode</th>
                <th style={thStyle}>Organisatie</th>
                <th style={thStyle}>Naam</th>
                <th style={thStyle}>Produkt</th>
                <th style={thStyle}>Bandenmaat</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Positie</th>
                <th style={thStyle}>ET</th>
                <th style={thStyle}>Aansluitmaat</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLabel?.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    ...(selectedRowId === item.id ? hoveredRowStyle : {}),
                  }}
                  onClick={() => setSelectedRowId(item.id)}
                  className="hoveredRow"
                >
                  <td style={tdStyle}>{item.barCode}</td>
                  <td style={tdStyle}>{item.organization}</td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.product}</td>
                  <td style={tdStyle}>{item.bandenmaat}</td>
                  <td style={tdStyle}>{item.type}</td>
                  <td style={tdStyle}>{item.positie}</td>
                  <td style={tdStyle}>{item.et}</td>
                  <td style={tdStyle}>{item.aansluitmaat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <div style={{ marginRight: "5%" }}>
            <Button
              style={{ marginRight: "50px" }}
              color="success"
              onClick={toggleTLFlowModSave}
            >
              Toevoegen
              <ToevLabel
                toggleTLFlowMod={toggleTLFlowModSave}
                loadAllOrdersStickers={loadAllOrdersStickers}
                tLPanelModal={tLPanelModalSave}
                isWijzigen={false}
                stickers={stickers}
              />
            </Button>
            <Button
              color="primary"
              style={{ marginRight: "50px" }}
              onClick={selectedRowId ? toggleTLFlowModUpdate : undefined}
            >
              Wijzigen
              {selectedRowId && (
                <ToevLabel
                  toggleTLFlowMod={toggleTLFlowModUpdate}
                  loadAllOrdersStickers={loadAllOrdersStickers}
                  tLPanelModal={tLPanelModalUpdate}
                  stickers={stickers}
                  selectedRowId={selectedRowId}
                  isWijzigen={true}
                />
              )}
            </Button>
            <Button
              color="secondary"
              style={{ marginRight: "20px" }}
              onClick={selectedRowId ?  toggle : undefined}
            >
              Verwijder
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody style={{ justifyContent: "center" }}>
          Remove the Entry with ID: {selectedRowId}
        </ModalBody>
        <ModalFooter style={{ justifyContent: "center" }}>
          <Button
            color="primary"
            value="yes"
            onClick={(event) => toggle(event.target.value)}
          >
            Yes
          </Button>{" "}
          <Button
            color="secondary"
            value="no"
            onClick={(event) => toggle(event.target.value)}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ZoekLabel;
