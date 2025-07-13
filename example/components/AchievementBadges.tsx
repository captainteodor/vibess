import React from 'react';
import { Card, CardBody, Avatar } from "@heroui/react";
import { Icon } from '@iconify/react';

export const AchievementBadges: React.FC = () => {
  const badges = [
    { name: "Star Gazer", icon: "lucide:star" },
    { name: "Heart Comet", icon: "lucide:heart" },
    { name: "Cosmic Connector", icon: "lucide:zap" },
  ];

  return (
    <Card className="bg-content1/30 backdrop-blur-md border-1 border-primary-200/50">
      <CardBody>
        <h3 className="text-xl font-semibold mb-4">Vibe Badges</h3>
        <div className="flex justify-around">
          {badges.map((badge) => (
            <div key={badge.name} className="flex flex-col items-center">
              <Avatar
                icon={<Icon icon={badge.icon} className="text-2xl" />}
                className="bg-gradient-to-br from-warning to-secondary-500 w-12 h-12"
              />
              <span className="text-sm mt-2">{badge.name}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};