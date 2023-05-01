import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";


export default function Attendance() {
  let use = localStorage.getItem("user");
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const [punchtime, setpunchtime] = useState([]);
  const [getuser1, setgetuser1] = useState([]);


  const getpunchindata = () => {
    axios.get(`http://localhost:4800/user/${use}`).then(function (response) {
      // console.log("response", response);
      setpunchtime(response.data.data);
    });
  };

  useEffect(() => {
    getpunchindata();
  }, []);

  const handleShow = (item) => {
    // console.log(item);
    setShow(true);
    setgetuser1(
      item?.attendance
        ?.replaceAll(/[/[","]|]/g, " ")
        .trim()
        .split("   ")
    );
  };
 

  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>date </th>
            <th>Effective Hours</th>
            {/* <th>Gross Hours</th> */}
            <th>Total Break</th>
            <th>Log</th>
          </tr>
        </thead>
        <tbody>
          {punchtime &&
            punchtime.map((item) => {
              let item1 = item?.attendance
                .replaceAll(/[/[","]|]/g, " ")
                .trim()
                .split("   ");

              var totalbreakStartTime = moment(
                item1[1] ? item1[1] : item1[0],
                "hh:mm:ss"
              );

              var totalbreakEndTime = moment(
                item1[4]
                  ? item1[4]
                  : item1[2]
                  ? item1[2]
                  : item1[1]
                  ? item1[1]
                  : item1[0],
                "hh:mm:ss"
              );

              var effectivehrs = moment
                .utc(totalbreakEndTime.diff(totalbreakStartTime))
                .format("HH");
              var effectivemin = moment
                .utc(totalbreakEndTime.diff(totalbreakStartTime))
                .format("mm");
              var effectivesec = moment
                .utc(totalbreakEndTime.diff(totalbreakStartTime))
                .format("ss");

              const totalBreak = [
                effectivehrs,
                effectivemin,
                effectivesec,
              ].join(":");
              // console.log("brak", totalBreak);
              var grossStartTime = moment(item1[0], "hh:mm:ss");
              var grossEndTime = moment(
                item1[5]
                  ? item1[5]
                  : item1[3]
                  ? item1[3]
                  : item1[1]
                  ? item1[1]
                  : item1[0],
                "hh:mm:ss"
              );

              var grosshrs = moment
                .utc(grossEndTime.diff(grossStartTime))
                .format("HH");
              var grossmin = moment
                .utc(grossEndTime.diff(grossStartTime))
                .format("mm");
              var grosssec = moment
                .utc(grossEndTime.diff(grossStartTime))
                .format("ss");
              const grossHours = [grosshrs, grossmin, grosssec].join(":");

              var time1 = moment(totalBreak, "HH:mm:ss");

              var time2 = moment(grossHours, "HH:mm:ss");

              const effectiveHours = moment
                .utc(moment(time2, "HH:mm:ss").diff(moment(time1, "HH:mm:ss")))
                .format("HH:mm:ss");

              return (
                <tr>
                  <td>{item.date}</td>
                  {/* <td>{effectiveHours}</td> */}
                  <td>{grossHours}</td>
                  <td>{totalBreak}</td>
                  
                  <td>
                    <button
                      className="bg bg-info"
                      onClick={() => {
                        handleShow(item);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
        <Modal show={show} onHide={() => handleClose()} animation={false}>
          <Modal.Body>
            {getuser1 &&
              getuser1.map((item, index) => (
                <div>
                  {index % 2 == 0 ? "Punch In" : "Punch Out"}
                  {item}
                </div>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <button variant="secondary" onClick={handleClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </Table>
     
      <Link to={"/dat"}>Attendance</Link>;
  
    </div>
  );
}
