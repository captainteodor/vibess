import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button, Progress, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from '@iconify/react';
import { motion, useAnimation } from 'framer-motion';

const VotingScreen: React.FC = () => {
  const [currentVibe, setCurrentVibe] = useState(50);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [aiHint, setAiHint] = useState("");
  const [isPremium, setIsPremium] = useState(false); // Simulating premium user status
  const cardControls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleVote = (increment: number) => {
    setCurrentVibe(prev => Math.min(Math.max(prev + increment, 0), 100));
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      handleVote(10);
      cardControls.start({ x: 300, opacity: 0 });
    } else if (info.offset.x < -100) {
      handleVote(-10);
      cardControls.start({ x: -300, opacity: 0 });
    } else {
      cardControls.start({ x: 0, y: 0 });
    }
  };

  const generateAIHint = () => {
    const hints = [
      "Strong smile energy—boost with adventure pose?",
      "Great eye contact! Try outdoor lighting for extra spark.",
      "Confident pose detected. Consider a vibrant background.",
      "Friendly vibe! A group photo might amplify your social energy.",
    ];
    setAiHint(hints[Math.floor(Math.random() * hints.length)]);
  };

  const triggerHapticFeedback = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200); // Vibrate for 200ms
    }
  };

  const handleVoteWithFeedback = (increment: number) => {
    handleVote(increment);
    triggerHapticFeedback();
    generateAIHint();
  };

  useEffect(() => {
    generateAIHint();
    const pulseAnimation = async () => {
      await cardControls.start({ scale: 1.05, transition: { duration: 0.5 } });
      await cardControls.start({ scale: 1, transition: { duration: 0.5 } });
    };
    pulseAnimation();
  }, [cardControls]);

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-secondary-300 animate-pulse">
        Align Vibes
      </h2>
      
      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={cardControls}
        className="w-full max-w-xl relative"
      >
        <Card className="bg-content1/30 backdrop-blur-md border-1 border-primary-200/50 overflow-visible">
          <CardBody className="p-0 overflow-hidden relative">
            <div className="relative aspect-[4/5]">
              <img
                src="https://img.heroui.chat/image/avatar?w=600&h=750&u=user1"
                alt="Profile of Cosmic Chris, 28, a stargazer and adventure seeker"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-semibold">Cosmic Chris, 28</h3>
                <p className="text-base">Stargazer & Adventure Seeker</p>
              </div>
            </div>
            <motion.div
              className="absolute inset-0 border-4 border-primary-500 rounded-lg"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(156, 39, 176, 0)",
                  "0 0 0 15px rgba(156, 39, 176, 0.3)",
                  "0 0 0 30px rgba(156, 39, 176, 0)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
          </CardBody>
        </Card>
        
        {isPremium && (
          <div className="absolute top-2 right-2 bg-warning-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            AR Available
          </div>
        )}
        
        <Button
          color="secondary"
          variant="flat"
          size="sm"
          className="absolute bottom-2 right-2"
          onPress={onOpen}
        >
          Expand Profile
        </Button>
      </motion.div>
      
      <div className="w-full max-w-md">
        <p className="text-center mb-2 font-semibold">Current Vibe Alignment</p>
        <Tooltip content={`${currentVibe}% aligned`} placement="top">
          <Progress 
            aria-label="Vibe alignment progress"
            value={currentVibe} 
            color="secondary"
            className="h-4 bg-content2/50"
          />
        </Tooltip>
      </div>
      
      {aiHint && (
        <div className="w-full max-w-md bg-content2/30 backdrop-blur-sm p-3 rounded-lg">
          <p className="text-sm text-center">
            <Icon icon="lucide:sparkles" className="inline-block mr-1" />
            AI Hint: {aiHint}
          </p>
        </div>
      )}
      
      <div className="flex justify-center space-x-6">
        <Tooltip content="Misalign" placement="top">
          <Button
            color="danger"
            variant="flat"
            isIconOnly
            className="w-16 h-16 rounded-full bg-danger/20"
            onPress={() => handleVoteWithFeedback(-10)}
          >
            <Icon icon="lucide:x" className="text-3xl" />
          </Button>
        </Tooltip>
        <Tooltip content="Slight Misalign" placement="top">
          <Button
            color="warning"
            variant="flat"
            isIconOnly
            className="w-16 h-16 rounded-full bg-warning/20"
            onPress={() => handleVoteWithFeedback(-5)}
          >
            <Icon icon="lucide:star-off" className="text-3xl" />
          </Button>
        </Tooltip>
        <Tooltip content="Slight Align" placement="top">
          <Button
            color="success"
            variant="flat"
            isIconOnly
            className="w-16 h-16 rounded-full bg-success/20"
            onPress={() => handleVoteWithFeedback(5)}
          >
            <Icon icon="lucide:star" className="text-3xl" />
          </Button>
        </Tooltip>
        <Tooltip content="Strong Align" placement="top">
          <Button
            color="primary"
            variant="flat"
            isIconOnly
            className="w-16 h-16 rounded-full bg-primary/20"
            onPress={() => handleVoteWithFeedback(10)}
          >
            <Icon icon="lucide:heart" className="text-3xl" />
          </Button>
        </Tooltip>
      </div>
      
      <p className="text-center text-sm italic text-foreground-500 animate-float">
        "Swipe through the cosmic sea of connections!"
      </p>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Cosmic Chris's Full Profile</ModalHeader>
          <ModalBody>
            <p><strong>Age:</strong> 28</p>
            <p><strong>Occupation:</strong> Astrophysicist</p>
            <p><strong>Interests:</strong> Stargazing, hiking, quantum physics</p>
            <p><strong>Bio:</strong> Looking for someone to explore the universe with, both metaphorically and literally. Let's stargaze and philosophize about our place in the cosmos.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {isPremium && (
        <Button
          color="warning"
          variant="flat"
          onPress={() => alert("AR feature activated! Imagine seeing a colorful aura around the photo.")}
        >
          <Icon icon="lucide:eye" className="mr-2" />
          View AR Aura
        </Button>
      )}
    </div>
  );
};

export default VotingScreen;