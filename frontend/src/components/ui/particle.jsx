import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for animations
const fadeFrames = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
`;

const scaleFrames = keyframes`
  0% {
    transform: scale3d(0.4, 0.4, 1);
  }
  50% {
    transform: scale3d(2.2, 2.2, 1);
  }
  100% {
    transform: scale3d(0.4, 0.4, 1);
  }
`;

// Helper function to generate random values
const getRandom = (max) => Math.floor(Math.random() * max);

// Generate keyframes for move animations dynamically
const generateMoveFrames = (index) => keyframes`
  from {
    transform: translate3d(${getRandom(100)}vw, ${getRandom(10) + 100}vh, 0);
  }
  to {
    transform: translate3d(${getRandom(100)}vw, ${- (getRandom(10) + 100) - getRandom(30)}vh, 0);
  }
`;

// Styled components
const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const CircleContainer = styled.div`
  position: absolute;
  transform: translateY(-10vh);
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  mix-blend-mode: screen;
  background-image: radial-gradient(
    hsl(180, 100%, 80%),
    hsl(180, 100%, 80%) 10%,
    hsla(180, 100%, 80%, 0) 56%
  );

  animation: ${fadeFrames} 200ms infinite, ${scaleFrames} 2s infinite;
`;

// Main React Component
const ParticleEffect = () => {
  const particles = Array.from({ length: 200 }, (_, i) => {
    const circleSize = getRandom(8) + 1;
    const moveFrames = generateMoveFrames(i);
    const moveDuration = 7000 + getRandom(4000);
    const animationDelay = getRandom(6500);
    const circleAnimationDelay = getRandom(2000);

    const Particle = styled(CircleContainer)`
      width: ${circleSize}px;
      height: ${circleSize}px;
      animation-name: ${moveFrames};
      animation-duration: ${moveDuration}ms;
      animation-delay: ${animationDelay}ms;

      & > div {
        animation-delay: ${circleAnimationDelay}ms;
      }
    `;

    return (
      <Particle key={i}>
        <Circle />
      </Particle>
    );
  });

  return <Container>{particles}</Container>;
};

export default ParticleEffect;
