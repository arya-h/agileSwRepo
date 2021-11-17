import React from "react";
import Button from "react-bootstrap/Button";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useState } from "react";
//redux
import { types } from "../../types/types";
import { ideaReducer } from "../../reducers/ideaReducer";

//import delete items from firestore
import { doc, deleteDoc } from "firebase/firestore";
//firestore
import { db } from "../../firebase/firebase-config";
//delete logo
import delete_logo from "../../assets/delete.png";
//stylesheet
import "../../style/ideas.css";

export const IdeaCard = ({ idea }) => {
  const [showPopover, setShowPopover] = useState(false); //delete popover state
  const [showErrorDelete, setShowErrorDelete] = useState(false); //show error in case delete has exceptions
  const [loadingDelete, setLoadingDelete] = useState(false);
  //   const [showDeleteToast, setShowDeleteToast] = useState(false); // show toast after delete

  //triggered when clicking on Yes button in popover
  const deleteIdea = async (id) => {
    
    setLoadingDelete(true);

    await deleteDoc(doc(db, "ideas", id))
    .then(()=>{setTimeout((o) => setLoadingDelete(!o), 3000);})
      .then(() => {
        //success
        setShowPopover(false);
        //redux part not working
        // ideaReducer({action:{
        //     type: types.ideasDelete,
        //     payload : id,
        // }});
        console.log("document " + id + " deleted");
      })
      .catch((err) => {
        console.log("Error : " + err);
        setShowPopover(false);
        setShowErrorDelete(true);
      });
  };

  //   const toastDelete = (
  //     <Toast onClose={() => setShowDeleteToast(true)} show={showDeleteToast} delay={3000} autohide>
  //       <Toast.Header>
  //         <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
  //         <strong className="me-auto">Bootstrap</strong>
  //         <small>11 mins ago</small>
  //       </Toast.Header>
  //       <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
  //     </Toast>
  //   );

  //popover to ask user if he's sure about deleting the idea
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Delete idea</Popover.Header>
      <Popover.Body>
        <Container fluid>
            {/* show spinner only if loading */}
          {loadingDelete ? (
            <Spinner
              animation="border"
              role="status"
              className="loading-delete-spinner"
            ></Spinner>
          ) : (
            <></>
          )}

          {/* text row */}
          <Row className="popover-row">
            <Col>Are you sure you want to delete this idea?</Col>
          </Row>
          {/* buttons row */}
          <Row className="popover-row">
            <Col>
              {/* button will be disabled while deleting */}
              <Button
                variant="danger"
                disabled={loadingDelete}
                onClick={() => deleteIdea(idea.id)}
              >
                Yes
              </Button>
            </Col>

            <Col>
              {/* button will be disabled while deleting */}
              <Button
                variant="primary"
                disabled={loadingDelete}
                onClick={(o) => setShowPopover(!o)}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Container>
      </Popover.Body>
    </Popover>
  );

  const removeUnderline = { textDecoration: "none" };
  return (
    <div className="card my-3">
      <toastDelete />
      <div className="card-body">
        <h5 className="card-title">{idea.title}</h5>
        <Container fluid>
          <p className="card-text">{idea.content}</p>
          <Row>
            {/* likes */}
            <Col xs={1} className="idea-button">
              <a href="#" className="card-link" style={removeUnderline}>
                <i class="fas fa-thumbs-up"></i> 0
              </a>
            </Col>

            {/* comments */}
            <Col xs={1} className="idea-button">
              <a href="#" className="card-link" style={removeUnderline}>
                <i class="far fa-comments"></i> 0
              </a>
            </Col>

            {/* delete button */}
            <Col xs={1} className="idea-button">
              <OverlayTrigger
                show={showPopover}
                rootClose
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <a href="#" onClick={() => setShowPopover(true)}>
                  <img src={delete_logo} height="15"></img>
                </a>
              </OverlayTrigger>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
