import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import React from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  saveSticker,
  updateSticker,
} from "../services/sticker-service";
import Draggable from "react-draggable";
import { getCurrentUserDetail, isLoggedIn } from "../auth";

function ToevLabel({
  tLPanelModal,
  toggleTLFlowMod,
  stickers,
  selectedRowId,
  isWijzigen,
  loadAllOrdersStickers
}) {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(null);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  useEffect(() => {
    setUser(getCurrentUserDetail());
    setLogin(isLoggedIn());

    if (isWijzigen && selectedRowId !== null) {
      const selectedEntry = stickers?.find((item) => item.id === selectedRowId);
      if (selectedEntry) {
        setEntry(selectedEntry);
      } else {
        setEntry(null);
      }
    }
  }, [isWijzigen, selectedRowId, stickers]);

  useEffect(() => {
console.log('entry stricker',entry);
  },[entry]);

  const saveFunction = () => {
    if (!entry?.product) {
      toast.error("Label Product is required.");
      return;
    }
    if (!isWijzigen) {
      const isDuplicateId = stickers.some(
        (item) => item.product.toString() === entry.product.toString()
      );
      if (isDuplicateId) {
        toast.error("Product already exists in the list.");
        return;
      }
      saveSticker(entry)
        .then((resp) => {
          toast.success("WheelColor is saved successfully with id " + resp.id);
          setEntry({
            id: 0,
            organization: "",
            name: "",
            product: "",
            externProduct: "",
            omsumin: "",
            opmerking: "",
            bandenmaat: "",
            type: "",
            loadIndex: "",
            positie: "",
            aansluitmaat: "",
            boutgat: "",
            et: "",
            sjabloon: "",
          });
          loadAllOrdersStickers();
        })
        .catch((error) => {
          console.log(error);
          console.log("Error log");
          toast.error("Failed to save");
          setError({
            errors: error,
            isError: true,
          });
        });
    } else {
      updateSticker(entry)
        .then((resp) => {
          toast.success(
            "Label is updated successfully with id " + resp.id
          );
          setEntry({
            id: 0,
            organization: "",
            name: "",
            product: "",
            externProduct: "",
            omsumin: "",
            opmerking: "",
            bandenmaat: "",
            type: "",
            loadIndex: "",
            positie: "",
            aansluitmaat: "",
            boutgat: "",
            et: "",
            sjabloon: "",
          });
          loadAllOrdersStickers();
        })
        .catch((error) => {
          console.log(error);
          console.log("Error log");
          toast.error("Failed to save");
          setError({
            errors: error,
            isError: true,
          });
        });
    }
  };

  const div1Style = {
    display: "flex",
    width: "100%",
    //height: "300px",
    marginRight: "5px",
    flexDirection: "column",
  };

  const div2Style = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  };

  return (
    <Draggable positionOffset={{ x: 0, y: 0 }} handle=".modal-header">
      <Modal
        isOpen={tLPanelModal}
        toggle={toggleTLFlowMod}
        fullscreen
        unmountOnClose
        backdrop="static"
        style={{
          maxWidth: "60%",
          maxHeight: "55%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: "20%",
          top: "22%",
        }}
      >
        <ModalHeader toggle={toggleTLFlowMod} className="modal-header">
          <strong>Toevoegen Label</strong>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex" }}>
            <div style={div1Style}>
              <label htmlFor="organization">
                <strong>Organisatie:</strong>
              </label>
              <input
                type="text"
                id="organization"
                style={{ width: "60%", marginBottom: "15px" }}
              //   onKeyPress={(e) => {
              //     if (!/[0-9\b]/.test(e.key)) {
              //       e.preventDefault();
              //     }
              //   }
              // }
                value={entry?.organization || ""}
                onChange={(e) => setEntry({ ...entry, organization: e.target.value })}
              />
              <label htmlFor="product">
                <strong>Produkt:</strong>
              </label>
              <input
                type="text"
                id="product"
                style={{ width: "60%", marginBottom: "20px" }}
                value={entry?.product}
                onChange={(e) =>
                  setEntry({ ...entry, product: e.target.value })
                }
                readOnly={isWijzigen}
              />
              <label htmlFor="bandenmaat" style={{}}>
                <strong>Bandenmaat:</strong>
              </label>
              <input
                type="text"
                id="bandenmaat"
                style={{ width: "60%", marginBottom: "3px" }}
                value={entry?.bandenmaat || ""}
                onChange={(e) =>
                  setEntry({ ...entry, bandenmaat: e.target.value })
                }
              />
              <label htmlFor="positie">
                <strong>Positie:</strong>
              </label>
              <input
                type="text"
                id="positie"
                style={{ width: "60%", marginBottom: "20px" }}
                value={entry?.positie || ""}
                onChange={(e) =>
                  setEntry({ ...entry, positie: e.target.value })
                }
              />
              <label htmlFor="sjabloon">
                <strong>Sjabloon:</strong>
              </label>
              <input
                type="text"
                id="sjabloon"
                style={{ width: "60%" }}
                value={entry?.sjabloon || ""}
                onChange={(e) =>
                  setEntry({ ...entry, sjabloon: e.target.value })
                }
              />
            </div>
            <div style={div2Style}>
              <label htmlFor="name">
                <strong>Naam:</strong>
              </label>
              <input
                type="text"
                id="name"
                style={{ width: "60%", marginBottom: "15px" }}
                value={entry?.name || ""}
                onChange={(e) =>
                  setEntry({ ...entry, name: e.target.value })
                }
              />
              <label htmlFor="externProduct">
                <strong>Extern Product:</strong>
              </label>
              <input
                type="text"
                id="externProduct"
                style={{ width: "60%", marginBottom: "20px" }}
                value={entry?.externProduct || ""}
                onChange={(e) =>
                  setEntry({ ...entry, externProduct: e.target.value })
                }
              />
              <label htmlFor="type">
                <strong>Type:</strong>
              </label>
              <input
                type="text"
                id="type"
                style={{ width: "60%", marginBottom: "3px" }}
                value={entry?.type || ""}
                onChange={(e) =>
                  setEntry({ ...entry, type: e.target.value })
                }
              />
              <label htmlFor="aansluitmaat">
                <strong>Aansluitmaat:</strong>
              </label>
              <input
                type="text"
                id="aansluitmaat"
                style={{ width: "60%" }}
                value={entry?.aansluitmaat || ""}
                onChange={(e) =>
                  setEntry({ ...entry, aansluitmaat: e.target.value })
                }
              />
            </div>

            <div
              style={{
                width: "100%",
                height: "100px",
                marginRight: "5px",
                display:"flex",
                flexDirection: "column"
              }}
            >
              <label htmlFor="omsumin" style={{marginTop: "40px"}}>
                <strong>Omschrijving:</strong>
              </label>
              <input
                type="text"
                id="omsumin"
                style={{ width: "60%" , marginBottom: "10px", }}
                value={entry?.omsumin || ""}
                onChange={(e) =>
                  setEntry({ ...entry, omsumin: e.target.value })
                }
              />
              <label htmlFor="opmerking">
                <strong>Opmerking:</strong>
              </label>
              <input
                type="text"
                id="opmerking"
                style={{ width: "60%",marginBottom: "10px",  }}
                value={entry?.opmerking || ""}
                onChange={(e) =>
                  setEntry({ ...entry, opmerking: e.target.value })
                }
              />
              <label htmlFor="loadIndex">
                <strong>Load Index:</strong>
              </label>
              <input
                type="text"
                id="loadIndex"
                style={{ width: "60%", marginBottom: "10px",  }}
                value={entry?.loadIndex || ""}
                onChange={(e) =>
                  setEntry({ ...entry, loadIndex: e.target.value })
                }
              />
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginLeft: "10px",
                }}
              >
                <label htmlFor="boutgat">
                  <strong>Boutgat:</strong>
                </label>

                <label htmlFor="et" style={{marginLeft: "60px"}}>
                  <strong>ET:</strong>
                </label>
               
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginRight: "5px",
                }}
              >
                <input
                  type="text"
                  id="boutgat"
                  style={{ marginLeft:"5px",width: "20%" }}
                  value={entry?.boutgat || ""}
                  onChange={(e) =>
                    setEntry({ ...entry, boutgat: e.target.value })
                  }
                />
                <input
                  type="text"
                  id="et"
                  style={{ marginLeft:"30px",width: "20%" }}
                  value={entry?.et || ""}
                  onChange={(e) =>
                    setEntry({ ...entry, et: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div style={{ marginRight: "10%" }}>
            <Button
              style={{ marginRight: "50px" }}
              color="primary"
              onClick={() => saveFunction()}
            >
              Opslaan
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Draggable>
  );
}

export default ToevLabel;
