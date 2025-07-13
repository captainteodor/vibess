import React from 'react';
import { Card, CardBody, Progress } from "@heroui/react";
import { Icon } from '@iconify/react';

export const VibeFeedback: React.FC = () => {
  return (
    <Card className="bg-content1/30 backdrop-blur-md border-1 border-primary-200/50 mb-8">
      <CardBody>
        <h3 className="text-xl font-semibold mb-4">Your Cosmic Vibe Report</h3>
        <div className="flex items-center mb-4">
          <Icon icon="lucide:smile" className="text-2xl text-success mr-2" />
          <span className="font-medium">Strengths: Your smile radiates!</span>
        </div>
        <div className="mb-4">
          <p className="mb-2">Swipe Boost Potential</p>
          <Progress 
            value={40} 
            color="secondary"
            className="h-3 bg-content2/50"
          />
        </div>
        <p className="text-sm italic">
          "Your energy is magnetic! Align further to unlock more cosmic connections."
        </p>
      </CardBody>
    </Card>
  );
};