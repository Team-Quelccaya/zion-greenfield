import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';
import reportAnswerAction from '../../../redux/actions/reportAnswer';
import QA_API from '../../../api/qa';
import ImageModal from '../Modal/ImageModal';

const dateFormatter = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const AnswerItem = ({ answer, reportAnswer }) => {
  const [helpfulness, setHelpfulness] = useState(answer.helpfulness);
  const [showImageModal, setShowImageModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(undefined);

  const handleAnswerHelpful = async () => {
    const answerInfo = JSON.parse(localStorage.getItem(answer.id));
    if (!answerInfo || !answerInfo.votedAnswerHelp) {
      const response = await QA_API.markAnswerHelpful(answer.id);
      if (!response.error) {
        setHelpfulness(helpfulness + 1);
        localStorage.setItem(
          answer.id,
          JSON.stringify({ ...answerInfo, votedAnswerHelp: true })
        );
      }
    }
  };

  const handleReportAnswer = async () => {
    const response = await QA_API.reportAnswer(answer.id);
    if (!response.error) reportAnswer(answer.id);
  };

  return (
    <div
      style={{
        paddingBottom: '20px',
        fontSize: '20px'
      }}
    >
      <ImageModal
        url={clickedImage}
        show={showImageModal}
        setShow={setShowImageModal}
      />
      <div data-testid="answerItem">
        <span className="QATitle">{answer.body}</span>
        <br />
        {answer.photos.map((photoUrl) => (
          <Image
            key={Math.random() * 1000}
            src={photoUrl}
            alt=" "
            style={{
              width: '160px',
              height: '100px',
              marginRight: '10px',
              marginTop: '12px',
              marginBottom: '12px',
              objectFit: 'cover'
            }}
            onClick={(e) => {
              setClickedImage(e.target.src);
              setShowImageModal(true);
            }}
          />
        ))}
        <div className="clickButton" style={{ fontSize: '16px' }}>
          by {answer.answerer_name}
          {', '}
          {dateFormatter(answer.date)} | Helpful?{' '}
          <button
            type="button"
            className="clickButton"
            style={{
              border: 'none',
              textDecoration: 'underline',
              outline: 'none'
            }}
            onClick={handleAnswerHelpful}
          >
            Yes
          </button>
          ({helpfulness}) |{' '}
          <button
            type="button"
            className="clickButton"
            style={{
              border: 'none',
              textDecoration: 'underline',
              outline: 'none'
            }}
            onClick={handleReportAnswer}
          >
            report
          </button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    reportAnswer: (id) => dispatch(reportAnswerAction(id))
  };
};

export default connect(null, mapDispatchToProps)(AnswerItem);
