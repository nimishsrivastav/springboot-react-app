import React from 'react';
import { Spinner, Card, Placeholder } from 'react-bootstrap';

interface LoadingProps {
  text?: string;
  size?: 'sm';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  text = 'Loading...', 
  size,
  className = '' 
}) => {
  return (
    <div className={`loading-spinner d-flex flex-column align-items-center justify-content-center py-5 ${className}`}>
      <Spinner animation="border" variant="primary" size={size} />
      {text && (
        <p className="text-muted mt-3 mb-0">{text}</p>
      )}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={12} />
          <Placeholder xs={12} />
          <Placeholder xs={8} />
        </Placeholder>
        <div className="d-flex gap-2 mb-3">
          <Placeholder.Button variant="secondary" xs={2} />
          <Placeholder.Button variant="secondary" xs={2} />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Placeholder xs={3} />
          <Placeholder xs={2} />
        </div>
      </Card.Body>
    </Card>
  );
};

interface SkeletonProps {
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ lines = 1 }) => {
  return (
    <Placeholder as="div" animation="glow">
      {Array.from({ length: lines }).map((_, index) => (
        <Placeholder 
          key={index} 
          xs={index === lines - 1 && lines > 1 ? 8 : 12} 
          className="mb-2"
        />
      ))}
    </Placeholder>
  );
};

export default Loading;