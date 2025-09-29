// src/components/WelcomeBackModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { Candidate } from "../redux/slices/interviewSlice";

interface Props {
  onContinue: () => void;
  onRestart: () => void;
}

const WelcomeBackModal: React.FC<Props> = ({ onContinue, onRestart }) => {
  const [visible, setVisible] = useState(false);
  const currentCandidate = useSelector(
    (s: RootState) => s.interview.currentCandidate
  ) as Candidate | null;

  useEffect(() => {
    if (currentCandidate && currentCandidate.answers.length < 6) {
      setVisible(true);
    }
  }, [currentCandidate]);

  return (
    <Modal
      open={visible}
      title="Welcome Back!"
      closable={false}
      footer={[
        <Button key="continue" type="primary" onClick={onContinue}>
          Continue
        </Button>,
        <Button key="restart" danger onClick={onRestart}>
          Restart
        </Button>,
      ]}
    >
      <p>We found an unfinished interview. Do you want to continue or restart?</p>
    </Modal>
  );
};

export default WelcomeBackModal;
