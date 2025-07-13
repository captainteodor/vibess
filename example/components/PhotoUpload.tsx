import React from 'react';
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from '@iconify/react';

export const PhotoUpload: React.FC = () => {
  return (
    <Card className="bg-content1/30 backdrop-blur-md border-1 border-primary-200/50 mb-8">
      <CardBody className="flex flex-col items-center p-8">
        <Icon icon="lucide:upload-cloud" className="text-6xl text-primary-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Align Your Aura</h2>
        <p className="text-center mb-4">Upload your photo to unlock cosmic potential</p>
        <Button 
          color="primary"
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-out"
          endContent={<Icon icon="lucide:star" />}
        >
          Submit Photo
        </Button>
      </CardBody>
    </Card>
  );
};