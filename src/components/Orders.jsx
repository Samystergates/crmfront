import React from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import {
  Button,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { printMonExp, printSmeExp, printSpuExp } from "./PrintUtil";
import {
  faFilter,
  faAdd,
  faSubtract,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { getCurrentUserDetail, isLoggedIn } from "../auth";
import { updateOrders, updateOrdersColors } from "../services/order-service";
import { loadAllStickers, printingMonPdf, printingStickerPdf } from "../services/print-service";
import "../css/ordersStyle.css";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import NavCanv from "./NavCanv";
import { doLogout } from "../auth";
import SmeModal from "./SmeModal";
import SpuModal from "./SpuModal";
function Orders({
  order,
  searchTerm,
  isMoreOptionsCanv,
  moreOptionsCanv,
  toggleConfirmation,
  confirmationModal,
  reloadOrders,
  loadOrders,
}) {
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(null);
  const [filteredOrder, setFilteredOrder] = useState([order]);
  const [itsOdanum, setItsOdanum] = useState(null);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [itsChecked, setItsChecked] = useState(false);
  const [itsIndex, setItsIndex] = useState(null);
  const [checkedStates, setCheckedStates] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [noteModal, setNoteModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [colorStateSme, setColorStateSme] = useState("D");
  const [colorStateSpu, setColorStateSpu] = useState("D");
  const [colorStateMLb, setColorStateMLb] = useState("D");
  const [colorStateMTr, setColorStateMTr] = useState("D");
  const [colorStateMwe, setColorStateMwe] = useState("D");
  const [colorStateSer, setColorStateSer] = useState("D");
  const [colorStateTra, setColorStateTra] = useState("D");
  const [colorStateExp, setColorStateExp] = useState("D");
  const [colorStateExc, setColorStateExc] = useState("D");
  const [filterStateOrderNum, setFilterStateOrderNum] = useState("Asc");
  const [filterStateBackorder, setFilterStateBackorder] = useState("Asc");
  const [filterStateGebruiker, setFilterStateGebruiker] = useState("Asc");
  const [filterStateLeverdatum, setFilterStateLeverdatum] = useState("Asc");
  const [filterDatumOrder, setfilterDatumOrder] = useState("Asc");
  const [filterStateLand, setFilterStateLand] = useState("Asc");
  const [filterStatePlaats, setFilterStatePlaats] = useState("Asc");
  const [filterStateNaam, setFilterStateNaam] = useState("Asc");
  const [spuPanelModal, setSpuPanelModal] = useState(false);
  const [smePanelModal, setSmePanelModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const [smeDropDownOpen, setSmeDropdownOpen] = useState(false);
  const [spuDropDownOpen, setSpuDropdownOpen] = useState(false);
  const [mlDropDownOpen, setMlDropdownOpen] = useState(false);
  const [mtDropDownOpen, setMtDropdownOpen] = useState(false);
  const [mweDropDownOpen, setMweDropdownOpen] = useState(false);
  const [serDropDownOpen, setSerDropdownOpen] = useState(false);
  const [traDropDownOpen, setTraDropdownOpen] = useState(false);
  const [expDropDownOpen, setExpDropdownOpen] = useState(false);
  const [rowDropDownOpen, setRowDropDownOpen] = useState([]);
  const [rowMainDropDownOpen, setRowMainDropDownOpen] = useState([]);
  const [currSpu, setCurrSpu] = useState(null);
  const [currSme, setCurrSme] = useState(null);
  const [orderX, setOrderX] = useState([order]);
  const flowForward = useRef("FWD");
  const flowReverse = useRef("RVS");
  const flowHalt = useRef("HLT");
  const orderNumberForNote = useRef("");
  const prodNumberForNote = useRef("");
  const flowDepName = useRef(null);
  const StatusDepName = useRef(null);
  const [note, setNote] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUserDetail());
    setLogin(isLoggedIn());
  }, []);

  useEffect(() => {
    if (searchTerm !== null) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredOrder(
        order?.filter(
          (item) =>
            item.customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.city.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.orderNumber.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }
  }, [searchTerm]);

  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState);

  const toggleSmeDropDown = () => setSmeDropdownOpen((prevState) => !prevState);
  const toggleSpuDropDown = () => setSpuDropdownOpen((prevState) => !prevState);
  const toggleMlDropDown = () => setMlDropdownOpen((prevState) => !prevState);
  const toggleMtDropDown = () => setMtDropdownOpen((prevState) => !prevState);
  const toggleMweDropDown = () => setMweDropdownOpen((prevState) => !prevState);
  const toggleSerDropDown = () => setSerDropdownOpen((prevState) => !prevState);
  const toggleTraDropDown = () => setTraDropdownOpen((prevState) => !prevState);
  const toggleExpDropDown = () => setExpDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    setUniqueUsers([...new Set(order?.map((item) => item.user))]?.sort());
    setOrderX(order);
    loadAllOrdersStickers();
  }, [order]);


  useEffect(() => {
    const newCheckedStates = [...checkedStates];
    orderX.forEach((item, index) => {
      if (item.backOrder === "B" && !newCheckedStates[item.orderNumber]) {
        newCheckedStates[item.orderNumber] =
          !newCheckedStates[item.orderNumber];
      }
    });
    setCheckedStates(newCheckedStates);
  }, [orderX]);

  useEffect(() => {
    setFilteredOrder(
      order?.filter((item) => selectedUsers.includes(item.user))
    );
  }, [selectedUsers]);

  useEffect(() => {
    setSelectedUsers([...uniqueUsers]);
  }, [uniqueUsers]);

  const updateForTra = (updatedTra) => {
    setOrderX(updatedTra);
  };

  const loadAllOrdersStickers = () => {
    loadAllStickers()
      .then((data) => {
        setStickers([...data]);
        if (data !== null) {
        } else {
          toast.error("In The Works");
        }
      })
      .catch((error) => {
        console.log(error);

        if (error?.message === "Network Error") {
          doLogout();
          window.location.reload();
        }
      });
  };

  const printingSticker = (key) => {
    printingStickerPdf(key)
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = "Sticker Product: " + key + ".pdf";
        link.click();

        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error fetching or processing PDF:", error);
      });
  }

  const handleFilterClick = (dep, colorState) => {
    let filteredData;
    switch (dep) {
      case "SME":
        filteredData = orderX.filter(item =>
          item?.sme !== "" &&
          item?.sme !== null &&
          ((colorState === "red" && item?.sme === "R") ||
            (colorState === "yellow" && item?.sme === "Y") ||
            (colorState === "green" && item?.sme === "G") ||
            (colorState === "blue" && item?.sme === "B"))
        );
        if (colorState !== "D") {
          setColorStateSme("ND");

          setColorStateSpu("D");
          setColorStateMLb("D");
          setColorStateMTr("D");
          setColorStateMwe("D");
          setColorStateSer("D");
          setColorStateTra("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          setColorStateSme("D");
        }
        break;
      case "SPU":
        console.log("working su", colorState);
        console.log("orderX:", orderX);

        filteredData = orderX.filter(item =>
          item?.spu !== "" && item?.spu !== undefined &&
          item?.spu !== null &&
          ((colorState === "red" && item?.spu === "R") ||
            (colorState === "yellow" && item?.spu === "Y") ||
            (colorState === "green" && item?.spu === "G") ||
            (colorState === "blue" && item?.spu === "B"))
        );
        console.log("ok now")
        console.log(filteredData);
        if (colorState !== "D") {
          setColorStateSpu("ND");

          setColorStateSme("D");
          setColorStateMLb("D");
          setColorStateMTr("D");
          setColorStateMwe("D");
          setColorStateSer("D");
          setColorStateTra("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          setColorStateSpu("D");
        }
        console.log("Filtered SPU Data:", filteredData);

        break;
      case "MONLB":
        filteredData = orderX.filter(item =>
          item?.monLb !== "" && item?.monLb !== undefined &&
          item?.monLb !== null &&
          ((colorState === "red" && item?.monLb === "R") ||
            (colorState === "yellow" && item?.monLb === "Y") ||
            (colorState === "green" && item?.monLb === "G") ||
            (colorState === "blue" && item?.monLb === "B"))
        );
        if (colorState !== "D") {
          setColorStateMLb("ND");

          setColorStateSme("D");
          setColorStateSpu("D");
          setColorStateMTr("D");
          setColorStateMwe("D");
          setColorStateSer("D");
          setColorStateTra("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          setColorStateMLb("D");
        }
        break;
      case "MONTR":
        filteredData = orderX.filter(item =>
          item?.monTr !== "" &&
          item?.monTr !== null &&
          ((colorState === "red" && item?.monTr === "R") ||
            (colorState === "yellow" && item?.monTr === "Y") ||
            (colorState === "green" && item?.monTr === "G") ||
            (colorState === "blue" && item?.monTr === "B"))
        );
        if (colorState !== "D") {
          setColorStateMTr("ND");

          setColorStateSme("D");
          setColorStateSpu("D");
          setColorStateMLb("D");
          setColorStateMwe("D");
          setColorStateSer("D");
          setColorStateTra("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          setColorStateMTr("D");
        }
        break;
      case "MWE":
        filteredData = orderX.filter(item =>
          item?.mwe !== "" &&
          item?.mwe !== null &&
          ((colorState === "red" && item?.mwe === "R") ||
            (colorState === "yellow" && item?.mwe === "Y") ||
            (colorState === "green" && item?.mwe === "G") ||
            (colorState === "blue" && item?.mwe === "B"))
        );
        if (colorState !== "D") {
          setColorStateMwe("ND");

          setColorStateSme("D");
          setColorStateSpu("D");
          setColorStateMTr("D");
          setColorStateMLb("D");
          setColorStateSer("D");
          setColorStateTra("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          setColorStateMwe("D");
        }
        break;
      case "SER":
        filteredData = orderX.filter(item =>
          item?.ser !== "" &&
          item?.ser !== null &&
          ((colorState === "red" && item?.ser === "R") ||
            (colorState === "yellow" && item?.ser === "Y") ||
            (colorState === "green" && item?.ser === "G") ||
            (colorState === "blue" && item?.ser === "B"))
        );
        if (colorState !== "D") {
          setColorStateSer("ND");

          setColorStateSme("D");
          setColorStateSpu("D");
          setColorStateMTr("D");
          setColorStateMLb("D");
          setColorStateMwe("D");
          setColorStateTra("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          console.log("cpoming in ")
          setColorStateSer("D");
        }
        break;
      case "TRA":
        filteredData = orderX.filter(item =>
          item?.tra !== "" &&
          item?.tra !== null &&
          ((colorState === "red" && item?.tra === "R") ||
            (colorState === "yellow" && item?.tra === "Y") ||
            (colorState === "green" && item?.tra === "G") ||
            (colorState === "blue" && item?.tra === "B"))
        );
        if (colorState !== "D") {
          setColorStateTra("ND");

          setColorStateSme("D");
          setColorStateSpu("D");
          setColorStateMTr("D");
          setColorStateMLb("D");
          setColorStateSer("D");
          setColorStateMwe("D");
          setColorStateExp("D");
          setColorStateExc("D");
        } else {
          setColorStateTra("D");
        }
        break;
      case "EXP":
        filteredData = orderX.filter(item =>
          item?.exp !== "" &&
          item?.exp !== null &&
          ((colorState === "red" && item?.exp === "R") ||
            (colorState === "yellow" && item?.exp === "Y") ||
            (colorState === "green" && item?.exp === "G") ||
            (colorState === "blue" && item?.exp === "B"))
        );
        if (colorState !== "D") {
          setColorStateExp("ND");

          setColorStateSme("D");
          setColorStateSpu("D");
          setColorStateMTr("D");
          setColorStateMLb("D");
          setColorStateSer("D");
          setColorStateMwe("D");
          setColorStateTra("D");
          setColorStateExc("D");
        } else {
          setColorStateExp("D");
        }
        break;
      case "EXC":
        filteredData = orderX.filter(item =>
          item?.exclamation === "JA"
        );
        setColorStateExc("ND");

        setColorStateSme("D");
        setColorStateSpu("D");
        setColorStateMTr("D");
        setColorStateMLb("D");
        setColorStateSer("D");
        setColorStateMwe("D");
        setColorStateTra("D");
        setColorStateExp("D");
        break;
      case "Naam":
        filteredData = [...orderX].sort(filterStateNaam === 'Asc'
          ? (a, b) => a.customerName.localeCompare(b.customerName)
          : (a, b) => b.customerName.localeCompare(a.customerName)
        );
        if (filterStateNaam === 'Asc') {
          setFilterStateNaam("Dsc");
        }
        if (filterStateNaam === 'Dsc') {
          setFilterStateNaam("Asc");
        }
        break;
        case "Backorder":
          filteredData = [...orderX].sort(filterStateBackorder === 'Asc'
            ? (a, b) => a.backOrder.localeCompare(b.backOrder)
            : (a, b) => b.backOrder.localeCompare(a.backOrder)
          );
          if (filterStateBackorder === 'Asc') {
            setFilterStateBackorder("Dsc");
          }
          if (filterStateBackorder === 'Dsc') {
            setFilterStateBackorder("Asc");
          }
          break;
      case "Verkooporder":
        filteredData = [...orderX].sort(filterStateOrderNum === 'Asc'
          ? (a, b) => a.orderNumber.localeCompare(b.orderNumber)
          : (a, b) => b.orderNumber.localeCompare(a.orderNumber)
        );
        if (filterStateOrderNum === 'Asc') {
          setFilterStateOrderNum("Dsc");
        }
        if (filterStateOrderNum === 'Dsc') {
          setFilterStateOrderNum("Asc");
        }
        break;
      case "Plaats":
        console.log(orderX);
        filteredData = [...orderX].sort(filterStatePlaats === 'Asc'
          ? (a, b) => a.city.localeCompare(b.city)
          : (a, b) => b.city.localeCompare(a.city)
        );
        console.log(filteredData);
        if (filterStatePlaats === 'Asc') {
          setFilterStatePlaats("Dsc");
        }
        if (filterStatePlaats === 'Dsc') {
          setFilterStatePlaats("Asc");
        }
        break;
      case "Land":
        filteredData = [...orderX].sort(filterStateLand === 'Asc'
          ? (a, b) => a.country.localeCompare(b.country)
          : (a, b) => b.country.localeCompare(a.country)
        );
        if (filterStateLand === 'Asc') {
          setFilterStateLand("Dsc");
        }
        if (filterStateLand === 'Dsc') {
          setFilterStateLand("Asc");
        }
        break;
      case "Leverdatum":
        filteredData = [...orderX].sort((a, b) => {
          const dateA = a.deliveryDate ? new Date(a.deliveryDate) : null;
          const dateB = b.deliveryDate ? new Date(b.deliveryDate) : null;

          if (!dateA && !dateB) return 0;
          if (!dateA) return filterStateLeverdatum === 'Asc' ? 1 : -1;
          if (!dateB) return filterStateLeverdatum === 'Asc' ? -1 : 1;

          return filterStateLeverdatum === 'Asc'
            ? dateA - dateB
            : dateB - dateA;
        });

        setFilterStateLeverdatum(
          filterStateLeverdatum === 'Asc' ? 'Dsc' : 'Asc'
        );
        break;
      case "Gebruiker":
        filteredData = [...orderX].sort(filterStateGebruiker === 'Asc'
          ? (a, b) => a.verifierUser.localeCompare(b.verifierUser)
          : (a, b) => b.verifierUser.localeCompare(a.verifierUser)
        );
        if (filterStateGebruiker === 'Asc') {
          setFilterStateGebruiker("Dsc");
        }
        if (filterStateGebruiker === 'Dsc') {
          setFilterStateGebruiker("Asc");
        }
        break;
      case "datumorder":
        filteredData = [...orderX].sort((a, b) => {
          const dateA = a.creationDate ? new Date(a.creationDate) : null;
          const dateB = b.creationDate ? new Date(b.creationDate) : null;

          if (!dateA && !dateB) return 0;
          if (!dateA) return filterDatumOrder === 'Asc' ? 1 : -1;
          if (!dateB) return filterDatumOrder === 'Asc' ? -1 : 1;

          return filterDatumOrder === 'Asc'
            ? dateA - dateB
            : dateB - dateA;
        });
        setfilterDatumOrder(
          filterDatumOrder === 'Asc' ? 'Dsc' : 'Asc'
        );
        break;
      case "D":
        filteredData = orderX;
        setColorStateSme("D");
        setColorStateSpu("D");
        setColorStateMTr("D");
        setColorStateMLb("D");
        setColorStateSer("D");
        setColorStateMwe("D");
        setColorStateTra("D");
        setColorStateExp("D");
        setColorStateExc("D");
        break;
      default:
        filteredData = orderX;
        break;
    }

    const orderNumbersToFilter = filteredData
      .filter(item => item?.orderNumber)
      .map(item => item.orderNumber);
    if (dep === "Backorder" || dep === "Naam" || dep === "Plaats" || dep === "Land" || dep === "Leverdatum" || dep === "Gebruiker" || dep === "datumorder") {
      const filteredAndParentItems = filteredData.filter(item =>
        orderNumbersToFilter.includes(item.orderNumber) && item.isParent === 1
      );

      setFilteredOrder(filteredAndParentItems);
    }
    else {
      const filteredAndParentItems = order.filter(item =>
        orderNumbersToFilter.includes(item.orderNumber)
      );

      setFilteredOrder(filteredAndParentItems);
    }
  };

  const updatingOrdersBO = (flowUpdate, orderDto) => {
    updateOrders(flowUpdate, orderDto)
      .then((data) => {
        if (data.length > 0) {
          const newCheckedStates = [...checkedStates];
          newCheckedStates[itsOdanum] = !newCheckedStates[itsOdanum];
          setCheckedStates(newCheckedStates);

          const updatedOrderList = orderX.map((items) => {
            if (items.id === orderDto.id) {
              return {
                ...items,
                backOrder: itsChecked ? "O" : "B",
                Departments: data
                  .filter((item) => item.id === orderDto.id)
                  .map((item) => item.Departments),
              };
            }
            return items;
          });
          setOrderX(updatedOrderList);
          toast.success("BO Successfully Updated");
        } else {
          toast.error("Refreshing, Empty List Received");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error("Failed to Update, logging in again" + error);
        setTimeout(() => {
          doLogout();
          window.location.reload();
        }, 2000);
      });
  };

  const updatingOrdersColorMain = (orderNumber, orderDep, orderStatus, flowVal, dep) => {
    console.log(orderNumber, orderDep, orderStatus, flowVal, dep);
    updateOrdersColors(orderNumber, orderDep, orderStatus, flowVal)
      .then((data) => {
        if (data.length > 0) {
          if (data) {
            if (orderX.length !== data.length) {
              setFilteredOrder(data);
              reloadOrders(data);
            }
            setOrderX(data);
            toast.success("Successfully Updated");

            if (dep === "MONLB" && orderStatus === "R" && flowVal === "FWD") {
              //printMonExp(orderNumber);
            }

            return true;
          }
        } else {
          toast.error("Refreshing, Empty List Received");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error("Failed to Update, logging in again" + error);
        setTimeout(() => {
          doLogout();
          window.location.reload();
        }, 2000);
        return false;
      });
  };

  const updatingOrdersColor = (flowUpdate, orderDto, dep) => {
    updateOrders(flowUpdate, orderDto)
      .then((data) => {
        if (data.length > 0) {
          if (data) {
            if (orderX.length !== data.length) {
              setFilteredOrder(data);
              reloadOrders(data);
            }

            setOrderX(data);
            toast.success("Successfully Updated");

            if (dep === "MON") {
              if (orderDto.mon === "Y") {
                //printMonExp(orderDto.orderNumber);
              }
            }

            console.log("updated");
            return true;
          }
        } else {
          toast.error("Refreshing, Empty List Received");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error("Failed to Update, logging in again" + error);
        setTimeout(() => {
          doLogout();
          window.location.reload();
        }, 2000);
        return false;
      });
  };

  const handleCheckboxChange = (index, isChecked, odanum) => {
    setItsIndex(index);
    setItsChecked(isChecked);
    setItsOdanum(odanum);
    toggle();
  };

  const toggleNoteModal = (odaNum, prdNum) => {
    orderNumberForNote.current = odaNum;
    prodNumberForNote.current = prdNum;
    setNoteModal(!noteModal);
  };

  const handleSaveNote = () => {
    console.log("Note saved:", note);

    toggleBOFlow(
      orderNumberForNote.current,
      prodNumberForNote.current,
      "EXCBO",
      "JA",
      note,
      flowForward
    );

    setNote("");
    setNoteModal(!noteModal);
  };

  const handleCheckboxClick = (event) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (event.target.value === "selectAll") {
        return event.target.checked ? [...uniqueUsers] : [];
      } else {
        return event.target.checked
          ? [...prevSelectedUsers, event.target.value]
          : prevSelectedUsers.filter(
            (selectedUser) => selectedUser !== event.target.value
          );
      }
    });
    setFilteredOrder(order.filter((item) => selectedUsers.includes(item.user)));
  };

  const renderBackorderColumn = (value, odanum, index) => {
    const isChecked = checkedStates[odanum] || false;
    if (value === "" || value === null || value === "O") {
      return (
        <input
          type="checkbox"
          style={{ width: "24px", height: "24px" }}
          color="primary"
          checked={isChecked}
          onChange={() => handleCheckboxChange(index, isChecked, odanum)}
        />
      );
    } else {
      return (
        <input
          type="checkbox"
          style={{ width: "24px", height: "24px" }}
          color="primary"
          checked={isChecked}
          onChange={() => handleCheckboxChange(index, isChecked, odanum)}
        />
      );
    }
  };

  const toggle = (val) => {
    if (
      user.departmentsSet[0].depName === "ADMIN" ||
      user.departmentsSet[0].depName === "EXCBO"
    ) {
      setModal(!modal);
      if (val === "yes") {
        const orderForUpdate = orderX.find(
          (order) => order.orderNumber === itsOdanum && order.isParent === 1
        );
        const updatedOrderBO = {
          ...orderForUpdate,
          backOrder: itsChecked ? "O" : "B",
        };

        updatingOrdersBO(true, updatedOrderBO);
      } else if (val === "no") {
      }
    } else {
      toast.error("UnAuthorized Department");
    }
  };

  const initToggleFlow = (key, oId, dep, currStatus, flowVal) => {
    if (dep === "SME" && flowVal !== flowHalt.current && currStatus !== "B") {
      const orderForUpdate = orderX.find((item) => item.id === oId);
      const index = orderForUpdate?.departments?.findIndex(
        (entry) => entry.depName === dep
      );
      if (index !== -1) {
        const previousEntries = orderForUpdate?.departments?.slice(0, index);
        const nextEntries = orderForUpdate?.departments?.slice(index + 1);

        const isValidPrevious = previousEntries.every(
          (entry) =>
            entry.status === "G" ||
            entry.status === "" ||
            (entry.status === "B" && entry.depName === "SPU")
        );
        const isValidNext = nextEntries.every(
          (entry) =>
            entry.status === "R" || entry.status === "" || entry.status === "B"
        );

        if (isValidNext && isValidPrevious) {
          toggleSmeFlowMod(key, oId, dep, currStatus);
        } else {
          toast.error("Complete Previous");
          console.log("error");
        }
      }
    } else if (
      dep === "SPU" &&
      flowVal !== flowHalt.current &&
      currStatus !== "B"
    ) {
      const orderForUpdate = orderX.find((item) => item.id === oId);
      const index = orderForUpdate?.departments?.findIndex(
        (entry) => entry.depName === dep
      );
      if (index !== -1) {
        const previousEntries = orderForUpdate?.departments?.slice(0, index);
        const nextEntries = orderForUpdate?.departments?.slice(index + 1);

        const isValidPrevious = previousEntries.every(
          (entry) =>
            entry.status === "G" ||
            entry.status === "" ||
            (entry.status === "R" &&
              entry.depName === "SME" &&
              currStatus === "")
        );
        const isValidNext = nextEntries.every(
          (entry) =>
            entry.status === "R" || entry.status === "" || entry.status === "B"
        );

        if (isValidNext && isValidPrevious) {
          toggleSpuFlowMod(key, oId, dep, currStatus);
        } else {
          toast.error("Complete Previous");
          console.log("error");
        }
      }
    } else {
      toggleFlow(key, oId, dep, currStatus, flowVal);
    }
  };

  const toggleFlowTra = (key, oId, dep, currStatus, flowVal) => {
    const keyArray = key.split(",").map((id) => parseInt(id.trim(), 10));
    const updatedOrderList = orderX.map((items) => {
      if (keyArray.includes(items.id)) {
        const updatedDepartments = items.departments.map((val) => {
          if (val.depName === dep) {
            return {
              ...val,
              prevStatus: currStatus,
              status:
                currStatus === "R" && flowVal === flowForward.current
                  ? "Y"
                  : currStatus === "Y" && flowVal === flowForward.current
                    ? "G"
                    : flowVal === flowHalt.current
                      ? "B"
                      : currStatus === "B" && flowVal === flowReverse.current
                        ? val.prevStatus
                        : currStatus,
            };
          } else {
            return val;
          }
        });
        return {
          ...items,
          tra: updatedDepartments.find((val) => val.depName === dep)?.status,
          departments: updatedDepartments,
        };
      }
      return items;
    });
    const flattenedUpdatedOrderList = [].concat(...updatedOrderList);
    const areAllDepartmentsG = keyArray.every((orderId) => {
      const order = flattenedUpdatedOrderList.find(
        (item) => item.id === orderId
      );
      if (order) {
        return order.departments.every(
          (department) => department.status === "G" || department.status === ""
        );
      }
      return false;
    });

    if (areAllDepartmentsG) {
      const updatedOrderListWithoutKeyArray = flattenedUpdatedOrderList.filter(
        (order) => !keyArray.includes(order.id)
      );
      setOrderX(updatedOrderListWithoutKeyArray);
      setFilteredOrder(updatedOrderListWithoutKeyArray);
      reloadOrders(updatedOrderListWithoutKeyArray);
    } else {
      setOrderX(flattenedUpdatedOrderList);
    }
  };

  const toggleTooltip = (orderNumber, product) => {
    setTooltipOpen((prev) => ({
      ...prev,
      [`${orderNumber}-${product}`]: !prev[`${orderNumber}-${product}`],
    }));
  };

  const toggleBOFlow = (onum, opd, dep, currStatus, noteExc, flowVal) => {
    const updatedOrderList = orderX.map((items) => {
      if (items.orderNumber === onum && items.product === opd) {
        return {
          ...items,
          exclamation: currStatus,
          excNote: note,
        };
      }
      return items;
    });

    updatingOrdersColor(
      true,
      updatedOrderList.find(
        (item) => item.orderNumber === onum && item.product === opd
      ), dep
    );
  };

  const toggleFlow = (key, oId, dep, currStatus, flowVal) => {
    if (dep === "SME" || dep === "SPU") {
      const orderForUpdate = orderX.find((item) => item.id === oId);
      const index = orderForUpdate?.departments?.findIndex(
        (entry) => entry.depName === dep
      );
      if (index !== -1) {
        const previousEntries = orderForUpdate?.departments?.slice(0, index);
        const nextEntries = orderForUpdate?.departments?.slice(index + 1);

        const isValidPrevious = previousEntries.every(
          (entry) =>
            entry.status === "G" ||
            entry.status === "" ||
            (entry.status === "R" && entry.depName === "SME" && dep === "SPU")
        );
        const isValidNext = nextEntries.every(
          (entry) =>
            entry.status === "R" || entry.status === "" || entry.status === "B"
        );
        if ((isValidNext && isValidPrevious) || currStatus === "B") {
          if (dep === "SME") {
            const foundObject = orderX.find((item) => item.id === oId);
            const smeDepartment = foundObject?.departments?.find(dep => dep.depName === "SME");
            if (currStatus === "") {
              setCurrSme({ ...currSme, sme: "R" });
            }
            if (currStatus === "R") {
              setCurrSme({ ...currSme, sme: "Y" });
            }
            if (currStatus === "Y") {
              setCurrSme({ ...currSme, sme: "G" });
            }
            if (currStatus === "B") {
              setCurrSme({ ...currSme, spu: smeDepartment?.prevStatus })
            }
          }

          if (dep === "SPU") {

            const smeDepartment = currSme?.departments?.find(dep => dep.depName === "SPU");
            if (currStatus === "") {
              setCurrSpu({ ...currSpu, spu: "R" });
            }
            if (currStatus === "R") {
              setCurrSpu({ ...currSpu, spu: "Y" });
            }
            if (currStatus === "Y") {
              setCurrSpu({ ...currSpu, spu: "G" });
            }
            if (currStatus === "B") {
              setCurrSpu({ ...currSpu, spu: smeDepartment?.prevStatus });
            }
          }
          flowDepName.current = dep.toLowerCase();
          if (dep.length === 5) {
            flowDepName.current =
              flowDepName.current.substr(0, 3) +
              flowDepName.current.charAt(3).toUpperCase() +
              flowDepName.current.substr(4);
          }

          const updatedOrderList = orderX.map((items) => {
            if (items.id === oId) {
              const updatedDepartments = items.departments.map((val) => {
                if (val.depName === dep) {
                  return {
                    ...val,
                    status:
                      currStatus === "" && flowVal === flowForward.current
                        ? "R"
                        : currStatus === "R" && flowVal === flowForward.current
                          ? "Y"
                          : currStatus === "Y" && flowVal === flowForward.current
                            ? "G"
                            : currStatus === "R" &&
                              flowVal === flowReverse.current &&
                              (dep === "SME" || dep === "SPU")
                              ? ""
                              : flowVal === flowHalt.current
                                ? "B"
                                : currStatus === "B" && flowVal === flowReverse.current
                                  ? val.prevStatus
                                  : currStatus,
                    prevStatus: currStatus,
                  };
                } else {
                  return val;
                }
              });

              return {
                ...items,
                [flowDepName.current]: updatedDepartments.find(
                  (val) => val.depName === dep
                )?.status,
                departments: updatedDepartments,
              };
            }

            return items;
          });

          updatingOrdersColor(
            true,
            updatedOrderList.find((item) => item.id === oId), dep
          );
        } else {
          toast.error("Complete Previous");
          console.log("error");
        }
      } else {
        console.log("dep not found in departments");
      }
    } else {
      const orderForON = orderX.find((item) => item.id === oId);
      const ordersWithSameNumber = orderX.filter(
        (item) => item.orderNumber === orderForON.orderNumber
      );

      let allConditionsMet = true;
      for (const orderForUpdate of ordersWithSameNumber) {
        const index = orderForUpdate?.departments?.findIndex(
          (entry) => entry.depName === dep
        );

        if (index !== -1) {
          const previousEntries = orderForUpdate?.departments?.slice(0, index);
          const nextEntries = orderForUpdate?.departments?.slice(index + 1);

          const isValidPrevious = previousEntries.every(
            (entry) =>
              entry.status === "G" ||
              entry.status === "" ||
              (entry.status === "R" && entry.depName === "SME" && dep === "SPU")
          );
          const isValidNext = nextEntries.every(
            (entry) =>
              entry.status === "R" ||
              entry.status === "" ||
              entry.status === "B"
          );
          if (isValidNext && isValidPrevious) {
          } else {
            toast.error("Complete Previous");
            console.log("error");
            allConditionsMet = false;
            break;
          }
        }
      }

      if (allConditionsMet) {
        for (const orderForUpdate of ordersWithSameNumber) {
          flowDepName.current = dep.toLowerCase();
          if (dep.length === 5) {
            flowDepName.current =
              flowDepName.current.substr(0, 3) +
              flowDepName.current.charAt(3).toUpperCase() +
              flowDepName.current.substr(4);
          }
          const updatedOrderList = orderX.map((items) => {
            if (items.id === orderForUpdate.id) {
              const updatedDepartments = items.departments.map((val) => {
                if (val.depName === dep) {
                  return {
                    ...val,
                    status:
                      currStatus === "" && flowVal === flowForward.current
                        ? "R"
                        : currStatus === "R" && flowVal === flowForward.current
                          ? "Y"
                          : currStatus === "Y" && flowVal === flowForward.current
                            ? "G"
                            : currStatus === "R" &&
                              flowVal === flowReverse.current &&
                              (dep === "SME" || dep === "SPU")
                              ? ""
                              : flowVal === flowHalt.current
                                ? "B"
                                : currStatus === "B" && flowVal === flowReverse.current
                                  ? val.prevStatus
                                  : currStatus,
                    prevStatus: currStatus,
                  };
                } else {
                  return val;
                }
              });

              return {
                ...items,
                [flowDepName.current]: updatedDepartments.find(
                  (val) => val.depName === dep
                )?.status,
                departments: updatedDepartments,
              };
            }

            return items;
          });
        }
        const fieldValue = orderForON[flowDepName.current];
        updatingOrdersColorMain(
          orderForON.orderNumber,
          flowDepName.current,
          fieldValue,
          flowVal,
          dep
        );
      }
    }
  };

  const toggleSmeFlowMod = (key, oId, dep, currStatus) => {
    setSmePanelModal(!smePanelModal);
    const foundObject = orderX.find((item) => item.id === oId);
    setCurrSme(foundObject);
  };

  const toggleSpuFlowMod = (key, oId, dep, currStatus) => {
    setSpuPanelModal(!spuPanelModal);
    const foundObject = orderX.find((item) => item.id === oId);
    setCurrSpu(foundObject);
  };

  const getColorDot = (oNum, value, oId, dep) => {
    const orderDep = orderX.find((item) => item.id === oId);
    // const depColor = orderDep[dep];

    const tempList = orderX.filter((item) => item.orderNumber === oNum);

    const tempColor = tempList?.map((val) => {
      return val[dep];
    });

    tempColor?.map((val) => {
      if (val === "B") {
        return "B";
      } else if (val === "R") {
        return "R";
      } else if (val === "Y") {
        return "Y";
      } else if (val === "G") {
        return "G";
      } else {
        return val;
      }
    });

    const colorPriority = ["B", "R", "Y", "G"];
    const depColor =
      colorPriority?.find((color) => tempColor?.includes(color)) || "";

    switch (depColor) {
      case "R":
        return <div className="dot red"></div>;
      case "G":
        return <div className="dot green"></div>;
      case "Y":
        return <div className="dot yellow"></div>;
      case "B":
        return <div className="dot blue"></div>;
      default:
        return "";
    }
  };

  const getChildColorDot = (oNum, value, oId, dep) => {
    const orderDep = orderX.find((item) => item.id === oId);
    const depColor = orderDep[dep];

    switch (depColor) {
      case "R":
        return <div className="dot red"></div>;
      case "G":
        return <div className="dot green"></div>;
      case "Y":
        return <div className="dot yellow"></div>;
      case "B":
        return <div className="dot blue"></div>;
      default:
        return null;
    }
  };

  const handleRowClick = (ordernNum) => {
    if (expandedRowIndex === ordernNum) {
      setExpandedRowIndex(null);
    } else {
      setExpandedRowIndex(ordernNum);
    }
  };

  const handleColClick = (productNum) => {
    setRowDropDownOpen((prevState) => {
      const updatedState = [...prevState];
      updatedState[productNum] = !prevState[productNum];
      return updatedState;
    });
  };

  const handleColClickMain = (orderNumber) => {
    setRowMainDropDownOpen((prevState) => {
      const updatedState = [...prevState];
      updatedState[orderNumber] = !prevState[orderNumber];
      return updatedState;
    });
  };

  const orderDepON = (onum) => {
    return orderX.find(
      (item) => item.orderNumber === onum && item.isParent === 1
    );
  };

  const renderDropdownItems = (dep, oId, oNm, key, currStatus) => {
    if (
      user.departmentsSet[0].depName === "ADMIN" ||
      user.departmentsSet[0].depName === dep
    ) {
      const orderDep = orderX.find((item) => item.id === oId);
      StatusDepName.current = dep?.toLowerCase();
      if (dep?.length === 5) {
        StatusDepName.current =
          StatusDepName.current.substr(0, 3) +
          StatusDepName.current.charAt(3).toUpperCase() +
          StatusDepName.current.substr(4);
      }
      const statusCode = orderDep?.[StatusDepName.current];

      if (checkedStates[oNm]) {
        return (
          <DropdownItem
            className="DropDown-Size"
            style={{ color: "#ccc", pointerEvents: "none" }}
            onClick={() => initToggleFlow(key, oId, dep, StatusDepName.current)}
          >
            {dep === "SME" && (
              <li
                style={{
                  pointerEvents: "none",
                  borderBottom: "2px solid #ccc",
                  padding: "8px 0",
                }}
              >
                Setup Smederij order
              </li>
            )}
            {dep === "SPU" && (
              <li
                style={{
                  pointerEvents: "none",
                  borderBottom: "2px solid #ccc",
                  padding: "8px 0",
                }}
              >
                Setup Spuiterij order
              </li>
            )}
          </DropdownItem>
        );
      }
      if (statusCode === "") {
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              //  onClick={() => toggleFlow(key, oId, dep, statusCode, flowForward)}
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowForward.current)
              }
            >
              {dep === "SME" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Setup Smederij order
                </li>
              )}
              {dep === "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Setup Spuiterij order
                </li>
              )}
            </DropdownItem>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowHalt.current)
              }
            >
              {dep === "SME" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Smederij Backorder
                </li>
              )}{" "}
              {dep === "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Spuiterij Backorder
                </li>
              )}
              {dep !== "SME" && dep !== "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  {dep} Backorder
                </li>
              )}
            </DropdownItem>
            {dep === "SME" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSmeExp(key)
                }
              >
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Smederij
                </li>

              </DropdownItem>
            )}
            {dep === "SPU" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSpuExp(key)
                }
              >

                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Spuiterij
                </li>

              </DropdownItem>
            )}
          </>
        );
      }
      if (statusCode === "R") {
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowForward.current)
              }
            >
              {dep === "SME" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Start Smederij
                </li>
              )}{" "}
              {dep === "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Start Spuiterij
                </li>
              )}
              {dep !== "SME" && dep !== "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Start {dep}
                </li>
              )}
            </DropdownItem>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowHalt.current)
              }
            >
              {dep === "SME" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Smederij Backorder
                </li>
              )}{" "}
              {dep === "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Spuiterij Backorder
                </li>
              )}
              {dep !== "SME" && dep !== "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  {dep} Backorder
                </li>
              )}
            </DropdownItem>
            {dep === "SME" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSmeExp(key)
                }
              >
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Smederij
                </li>

              </DropdownItem>
            )}
            {dep === "SPU" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSpuExp(key)
                }
              >

                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Spuiterij
                </li>

              </DropdownItem>
            )}
          </>
        );
      }
      if (statusCode === "Y") {
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowForward.current)
              }
            >
              {dep === "SME" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Afmelden Smederij
                </li>
              )}{" "}
              {dep === "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Afmelden Spuiterij
                </li>
              )}
              {dep !== "SME" && dep !== "SPU" && (
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Afmelden {dep}
                </li>
              )}
            </DropdownItem>
            {dep === "SME" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSmeExp(key)
                }
              >
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Smederij
                </li>

              </DropdownItem>
            )}
            {dep === "SPU" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSpuExp(key)
                }
              >
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Spuiterij
                </li>

              </DropdownItem>
            )}
          </>
        );
      }
      if (statusCode === "G") {
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              style={{ color: "#ccc", pointerEvents: "none" }}
            >
              <li
                style={{
                  pointerEvents: "none",
                  borderBottom: "2px solid #ccc",
                  padding: "8px 0",
                }}
              >
                Completed {dep}
              </li>
            </DropdownItem>
            {dep === "SME" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSmeExp(key)
                }
              >
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Smederij
                </li>

              </DropdownItem>
            )}
            {dep === "SPU" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSpuExp(key)
                }
              >

                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Spuiterij
                </li>

              </DropdownItem>
            )}
          </>
        );
      }
      if (statusCode === "B") {
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowReverse.current)
              }
            >
              <li style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}>
                Mark {dep} Available
              </li>
            </DropdownItem>
            {dep === "SME" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSmeExp(key)
                }
              >
                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Smederij
                </li>

              </DropdownItem>
            )}
            {dep === "SPU" && (
              <DropdownItem
                className="DropDown-Size"
                onClick={() =>
                  printSpuExp(key)
                }
              >

                <li
                  style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}
                >
                  Print Spuiterij
                </li>

              </DropdownItem>
            )}
          </>
        );
      }

      if (dep === "MONLB") {
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                initToggleFlow(key, oId, dep, statusCode, flowReverse.current)
              }
            >
              <li style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}>
                Mark {dep} Available
              </li>
            </DropdownItem>
          </>
        );
      }


      if (dep === "MONLB-PRINT") {
        const orderNumberMonPrint = key.split(",")[0];
        return (
          <>
            <DropdownItem
              className="DropDown-Size"
              onClick={() =>
                printMonExp(orderNumberMonPrint)
              }
            >
              <li style={{ borderBottom: "2px solid #ccc", padding: "8px 0" }}>
                {dep}
              </li>
            </DropdownItem>
          </>
        );
      }
    }
    return null;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th onClick={() => handleFilterClick("Verkooporder")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Verkooporder</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStateOrderNum === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th>Ordersoort</th>
            <th onClick={() => handleFilterClick("Backorder")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Backorder</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStateBackorder === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={smeDropDownOpen} toggle={toggleSmeDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>SME</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateSme === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SME", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SME", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SME", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SME", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={spuDropDownOpen} toggle={toggleSpuDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>SPU</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateSpu === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SPU", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SPU", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SPU", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SPU", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={mlDropDownOpen} toggle={toggleMlDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>MON LB</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateMLb === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONLB", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONLB", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONLB", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONLB", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={mtDropDownOpen} toggle={toggleMtDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>MON TR</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateMTr === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONTR", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONTR", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONTR", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MONTR", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={mweDropDownOpen} toggle={toggleMweDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>MWE</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateMwe === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MWE", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MWE", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MWE", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("MWE", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={serDropDownOpen} toggle={toggleSerDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>SER</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateSer === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SER", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SER", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SER", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("SER", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={traDropDownOpen} toggle={toggleTraDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>TRA</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateTra === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("TRA", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("TRA", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("TRA", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("TRA", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={expDropDownOpen} toggle={toggleExpDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>EXP</span>
                    <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateExp === "D" ? 'black' : '#7E8D85' }} />
                  </div>
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <>
                    <DropdownItem onClick={() => handleFilterClick("D", "D")}>
                      <label>
                        ----- Default -----
                      </label>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("EXP", "red")}>
                      <div style={{ backgroundColor: 'rgb(204, 80, 80)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("EXP", "yellow")}>
                      <div style={{ backgroundColor: 'rgb(223, 212, 62)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("EXP", "green")}>
                      <div style={{ backgroundColor: 'rgb(52, 151, 52)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleFilterClick("EXP", "blue")}>
                      <div style={{ backgroundColor: 'rgb(64, 64, 206)' }}>
                        <label></label>
                      </div>
                    </DropdownItem>
                  </>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th onClick={() => handleFilterClick("EXC")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>!</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: colorStateExc === "D" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th style={{ overflow: "hidden" }}>
              <Dropdown isOpen={dropDownOpen} toggle={toggleDropDown}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  Gebruiker (I)
                  <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px' }} />
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <DropdownItem>
                    <label>
                      <input
                        type="checkbox"
                        style={{ width: "18px", height: "18px" }}
                        value="selectAll"
                        onChange={(event) => handleCheckboxClick(event)}
                        checked={selectedUsers.length === uniqueUsers.length}
                      />{" "}
                      - Select All/None
                    </label>
                  </DropdownItem>
                  <div
                    style={{ borderTop: "1px dashed #ccc", margin: "0.5rem 0" }}
                  />
                  {uniqueUsers.map((checkUser, index) => (
                    <>
                      <DropdownItem key={index}>
                        <label>
                          <input
                            type="checkbox"
                            style={{ width: "18px", height: "18px" }}
                            value={checkUser}
                            onChange={(event) => handleCheckboxClick(event)}
                            checked={selectedUsers.includes(checkUser)}
                          />{" "}
                          - {checkUser}
                        </label>
                      </DropdownItem>
                      <div
                        style={{
                          borderTop: "1px dashed #ccc",
                          margin: "0.5rem 0",
                        }}
                      />
                    </>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </th>
            <th>Organisatie</th>
            <th onClick={() => handleFilterClick("Naam")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Naam</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStateNaam === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th>Postcode</th>
            <th onClick={() => handleFilterClick("Plaats")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Plaats</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStatePlaats === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th onClick={() => handleFilterClick("Land")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Land</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStateLand === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th onClick={() => handleFilterClick("Leverdatum")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Leverdatum</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStateLeverdatum === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th>Referentie</th>
            <th onClick={() => handleFilterClick("datumorder")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Datum order</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterDatumOrder === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
            <th onClick={() => handleFilterClick("Gebruiker")}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>Gebruiker (L)</span>
                <FontAwesomeIcon icon={faFilter} style={{ marginTop: '5px', color: filterStateGebruiker === "Asc" ? 'black' : '#7E8D85' }} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrder
            ?.filter((item) => item.isParent === 1)
            .map((item, index) => (
              <React.Fragment key={`${item.id},${index}`}>
                {item.isParent === 1 && (
                  <tr
                    key={`${item.orderNumber},${item.product}`}
                    onClick={(e) => {
                      handleColClickMain(item.orderNumber);
                      e.stopPropagation();
                    }}
                  >
                    <td
                      style={{ color: "light" }}
                      onClick={(e) => {
                        handleRowClick(item.orderNumber);
                        e.stopPropagation();
                      }}
                    >
                      {expandedRowIndex === item.orderNumber ? (
                        <FontAwesomeIcon icon={faSubtract} />
                      ) : (
                        <FontAwesomeIcon icon={faAdd} />
                      )}
                    </td>
                    <td>{item.orderNumber}</td>
                    <td>{item.orderType}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {renderBackorderColumn(
                        item.backOrder,
                        item.orderNumber,
                        item.id
                      )}
                    </td>
                    <td>
                      {getColorDot(item.orderNumber, item?.sme, item.id, "sme")}
                    </td>
                    <td>
                      {getColorDot(item.orderNumber, item?.spu, item.id, "spu")}
                    </td>
                    <td>
                      <Dropdown
                        isOpen={rowMainDropDownOpen[item.orderNumber]}
                        toggle={() => {
                          handleColClickMain(item.orderNumber);
                        }}
                      >
                        <DropdownToggle data-toggle="dropdown" tag="span">
                          {getColorDot(
                            item.orderNumber,
                            item.monLb,
                            item.id,
                            "monLb"
                          )}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            header
                            style={{
                              fontWeight: "bold",
                              fontSize: "large",
                            }}
                            className="dropdown-header"
                          >
                            Order: {item.orderNumber+item.regel}
                          </DropdownItem>

                          {item.orderType === "LAS" &&
                            renderDropdownItems(
                              "EXP",
                              item.id,
                              item.orderNumber,
                              `${item.orderNumber},${item.product}`,
                              item.exp
                            )}
                          {item.orderType === "LSO" &&
                            renderDropdownItems(
                              "SER",
                              item.id,
                              item.orderNumber,
                              `${item.orderNumber},${item.product}`,
                              item.ser
                            )}
                          {item.orderType === "MAO" && (
                            <>
                              {renderDropdownItems(
                                "MONLB",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monLb
                              )}
                              {renderDropdownItems(
                                "EXP",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.exp
                              )}
                            </>
                          )}
                          {item.orderType === "MLO" && (
                            <>
                              {" "}
                              {renderDropdownItems(
                                "MONLB",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monLb
                              )}
                            </>
                          )}
                          {item.orderType === "MWO" && (
                            <>
                              {renderDropdownItems(
                                "MWE",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.mwe
                              )}
                            </>
                          )}
                          {item.orderType === "MSO" && (
                            <>
                              {renderDropdownItems(
                                "MONLB",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monLb
                              )}
                              {renderDropdownItems(
                                "SER",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.ser
                              )}
                            </>
                          )}
                          {item.orderType === "MLT" && (
                            <>
                              {renderDropdownItems(
                                "MONTR",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monTr
                              )}
                            </>
                          )}
                          {item.orderType === "MST" && (
                            <>
                              {renderDropdownItems(
                                "MONTR",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monTr
                              )}
                              {renderDropdownItems(
                                "SER",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.ser
                              )}
                            </>
                          )}
                          {item.orderType === "LAP" && (
                            <>
                              {renderDropdownItems(
                                "EXP",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.exp
                              )}
                            </>
                          )}
                          {item.orderType === "LSP" &&
                            renderDropdownItems(
                              "SER",
                              item.id,
                              item.orderNumber,
                              `${item.orderNumber},${item.product}`,
                              item.ser
                            )}
                          {item.orderType === "MAP" && (
                            <>
                              {renderDropdownItems(
                                "MONLB",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monLb
                              )}
                              {renderDropdownItems(
                                "EXP",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.exp
                              )}
                            </>
                          )}
                          {item.orderType === "MLP" && (
                            <>
                              {renderDropdownItems(
                                "MONLB",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monLb
                              )}
                            </>
                          )}
                          {item.orderType === "MWP" && (
                            <>
                              {renderDropdownItems(
                                "MWE",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.mwe
                              )}
                            </>
                          )}
                          {item.orderType === "MSP" && (
                            <>
                              {renderDropdownItems(
                                "MONLB",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monLb
                              )}
                              {renderDropdownItems(
                                "SER",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.ser
                              )}
                            </>
                          )}
                          {(item.orderType === "MSP" || item.orderType === "MLP" || item.orderType === "MAP" || item.orderType === "MSO" || item.orderType === "MAO" || item.orderType === "MLO") && (
                            <>
                              {renderDropdownItems(
                                "MONLB-PRINT",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.mwe
                              )}
                            </>
                          )}
                          {item.orderType === "MSE" && (
                            <>
                              {renderDropdownItems(
                                "MONTR",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monTr
                              )}
                              {renderDropdownItems(
                                "SER",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.ser
                              )}
                            </>
                          )}
                          {item.orderType === "MLE" && (
                            <>
                              {renderDropdownItems(
                                "MONTR",
                                item.id,
                                item.orderNumber,
                                `${item.orderNumber},${item.product}`,
                                item.monTr
                              )}
                            </>
                          )}
                          {(orderDepON(item.orderNumber)?.exclamation === "" ||
                            orderDepON(item.orderNumber)?.exclamation ===
                            null ||
                            orderDepON(item.orderNumber)?.exclamation ===
                            "NEE") &&
                            (user.departmentsSet[0].depName === "ADMIN" ||
                              user.departmentsSet[0].depName === "EXCBO") && (
                              <DropdownItem
                                className="DropDown-Size"
                                onClick={() =>
                                  toggleNoteModal(
                                    item.orderNumber,
                                    item.product
                                  )
                                }
                              >
                                <li
                                  style={{
                                    borderBottom: "2px solid #ccc",
                                    padding: "8px 0",
                                  }}
                                >
                                  Add Note
                                </li>
                              </DropdownItem>
                            )}

                          {orderDepON(item.orderNumber)?.exclamation === "JA" &&
                            (user.departmentsSet[0].depName === "ADMIN" ||
                              user.departmentsSet[0].depName === "EXCBO") && (
                              <DropdownItem
                                className="DropDown-Size"
                                onClick={() =>
                                  toggleBOFlow(
                                    item.orderNumber,
                                    item.product,
                                    "EXCBO",
                                    "NEE",
                                    flowReverse
                                  )
                                }
                              >
                                <li
                                  style={{
                                    borderBottom: "2px solid #ccc",
                                    padding: "8px 0",
                                  }}
                                >
                                  Remove Note
                                </li>
                              </DropdownItem>
                            )}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      {getColorDot(
                        item.orderNumber,
                        item.monTr,
                        item.id,
                        "monTr"
                      )}
                    </td>
                    <td>
                      {getColorDot(item.orderNumber, item.mwe, item.id, "mwe")}
                    </td>
                    <td>
                      {getColorDot(item.orderNumber, item.ser, item.id, "ser")}
                    </td>
                    <td>
                      {getColorDot(item.orderNumber, item.tra, item.id, "tra")}
                    </td>
                    <td>
                      {getColorDot(item.orderNumber, item.exp, item.id, "exp")}
                    </td>
                    <td>
                      {orderX.find(
                        (entry) =>
                          entry.orderNumber === item.orderNumber &&
                          entry.product === item.product
                      )?.exclamation === "JA" && (
                          <div
                            style={{ color: "yellow", display: "inline-block" }}
                            id={`icon-${item.orderNumber}-${item.product}`}
                          >
                            <FontAwesomeIcon
                              icon={faExclamationTriangle}
                              style={{
                                fontSize: "1.3em",
                                color: "black",
                              }}
                              onMouseOver={() =>
                                toggleTooltip(item.orderNumber, item.product)
                              }
                              onMouseOut={() =>
                                toggleTooltip(item.orderNumber, item.product)
                              }
                            />
                            <Tooltip
                              placement="bottom"
                              isOpen={
                                tooltipOpen[`${item.orderNumber}-${item.product}`]
                              }
                              target={`icon-${item.orderNumber}-${item.product}`}
                              toggle={() =>
                                toggleTooltip(item.orderNumber, item.product)
                              }
                            >
                              {
                                orderX.find(
                                  (entry) =>
                                    entry.orderNumber === item.orderNumber &&
                                    entry.product === item.product
                                ).excNote
                              }
                            </Tooltip>
                          </div>
                        )}
                    </td>
                    <td>{item.user}</td>
                    <td>{item.organization}</td>
                    <td>{item.customerName}</td>
                    <td>{item.postCode}</td>
                    <td>{item.city}</td>
                    <td>{item.country}</td>
                    <td>{item.deliveryDate}</td>
                    <td>{item.referenceInfo}</td>
                    <td>{item.creationDate}</td>
                    <td>{item.verifierUser}</td>
                  </tr>
                )}

                {expandedRowIndex === item.orderNumber &&
                  item.isParent === 1 && (
                    <tr>
                      <td className="inner-td" colSpan={22}>
                        <table>
                          <thead>
                            <tr>
                              <th>Regel</th>
                              <th>BO</th>
                              <th>SME</th>
                              <th>SPU</th>
                              <th>Aantal</th>
                              <th>Product</th>
                              <th>Omschrijving</th>
                              <th>Leverdatum</th>
                              <th>Gebruiker_I</th>
                              <th>MON LB</th>
                              <th>MON TR</th>
                              <th>MWE</th>
                              <th>SER</th>
                              <th>TRA</th>
                              <th>EXP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrder.sort((a, b) => a.regel - b.regel).map(
                              (itemC, key) =>
                                item.orderNumber === itemC.orderNumber &&
                                item.isParent === 1 && (
                                  <tr
                                    key={`${itemC.orderNumber},${itemC.product}`}
                                    onClick={(e) => {
                                      handleColClick(itemC.product);
                                      e.stopPropagation();
                                    }}
                                  >
                                    <td>{itemC.regel}</td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                      {renderBackorderColumn(
                                        itemC.backOrder,
                                        itemC.orderNumber,
                                        itemC.id
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC?.sme,
                                        itemC.id,
                                        "sme"
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC?.spu,
                                        itemC.id,
                                        "spu"
                                      )}
                                    </td>
                                    <td>
                                      <Dropdown
                                        isOpen={rowDropDownOpen[itemC.product]}
                                        toggle={() => {
                                          handleColClick(itemC.product);
                                        }}
                                      >
                                        <DropdownToggle
                                          data-toggle="dropdown"
                                          tag="span"
                                        >
                                          {itemC.aantal}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          <DropdownItem
                                            header
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "large",
                                            }}
                                            className="dropdown-header"
                                          >
                                            Order: {itemC.orderNumber+itemC.regel},{" "}
                                            {itemC.product}
                                          </DropdownItem>
                                          {renderDropdownItems(
                                            "SME",
                                            itemC.id,
                                            itemC.orderNumber,
                                            `${itemC.orderNumber},${itemC.product}`,
                                            itemC?.sme
                                          )}
                                          {renderDropdownItems(
                                            "SPU",
                                            itemC.id,
                                            itemC.orderNumber,
                                            `${itemC.orderNumber},${itemC.product}`,
                                            itemC?.spu
                                          )}

                                          {stickers.some(
                                            (item) =>
                                              item.product === itemC.product
                                          ) && (
                                              <DropdownItem
                                                className="DropDown-Size"
                                                onClick={() =>
                                                  printingSticker(itemC.product)
                                                }
                                              >
                                                <li
                                                  style={{
                                                    borderBottom:
                                                      "2px solid #ccc",
                                                    padding: "8px 0",
                                                  }}
                                                >
                                                  Print Sticker
                                                </li>
                                              </DropdownItem>
                                            )}
                                        </DropdownMenu>
                                      </Dropdown>
                                    </td>
                                    <td>{itemC.product}</td>
                                    <td>{itemC.omsumin}</td>
                                    <td>{itemC.deliveryDate}</td>
                                    <td>{itemC.user}</td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC.monLb,
                                        itemC.id,
                                        "monLb"
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC.monTr,
                                        itemC.id,
                                        "monTr"
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC.mwe,
                                        itemC.id,
                                        "mwe"
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC.ser,
                                        itemC.id,
                                        "ser"
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC.tra,
                                        itemC.id,
                                        "tra"
                                      )}
                                    </td>
                                    <td>
                                      {getChildColorDot(
                                        itemC.orderNumber,
                                        itemC.exp,
                                        itemC.id,
                                        "exp"
                                      )}
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
        </tbody>
      </table>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody style={{ justifyContent: "center" }}>
          Change Back Office Status for Order {itsOdanum}
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

      <Modal isOpen={confirmationModal} toggle={toggleConfirmation}>
        <ModalBody style={{ justifyContent: "center" }}>
          Start CRM Orders Fetching Process?
        </ModalBody>
        <ModalFooter style={{ justifyContent: "center" }}>
          <Button
            color="primary"
            value="yes"
            onClick={(event) => toggleConfirmation(event.target.value)}
          >
            Yes
          </Button>{" "}
          <Button
            color="secondary"
            value="no"
            onClick={(event) => toggleConfirmation(event.target.value)}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={noteModal} toggle={toggleNoteModal}>
        <ModalHeader toggle={toggleNoteModal}>Add Note</ModalHeader>
        <ModalBody
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here"
            rows="3"
            cols="60"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveNote}>
            Save
          </Button>{" "}
          <Button color="secondary" onClick={toggleNoteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <SmeModal
        smePanelModal={smePanelModal}
        toggleSmeFlowMod={toggleSmeFlowMod}
        currSme={currSme}
        toggleFlow={toggleFlow}
      />

      <SpuModal
        spuPanelModal={spuPanelModal}
        toggleSpuFlowMod={toggleSpuFlowMod}
        currSpu={currSpu}
        toggleFlow={toggleFlow}
      />

      <NavCanv
        isMoreOptionsCanv={isMoreOptionsCanv}
        moreOptionsCanv={moreOptionsCanv}
        updateForTra={updateForTra}
        orderX={orderX}
        stickers={stickers}
        toggleFlowTra={toggleFlowTra}
        loadAllOrdersStickers={loadAllOrdersStickers}
      />
    </div>
  );
}

export default Orders;
