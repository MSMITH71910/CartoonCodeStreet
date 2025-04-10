# How to Apply Changes to the 3D Portfolio Street

This guide explains how to make changes to different aspects of the 3D Portfolio Street application.

## Table of Contents

1. [Editing Project Data](#editing-project-data)
2. [Customizing the Street](#customizing-the-street)
3. [Modifying Character Movement](#modifying-character-movement)
4. [Changing House Appearance](#changing-house-appearance)
5. [Adding New Interactive Objects](#adding-new-interactive-objects)
6. [Adjusting Camera Settings](#adjusting-camera-settings)
7. [Styling Project Details](#styling-project-details)
8. [Advanced Customizations](#advanced-customizations)

## Editing Project Data

For detailed instructions on editing project data, see the [PROJECT_EDITING_GUIDE.md](PROJECT_EDITING_GUIDE.md) file.

## Customizing the Street

The street environment is defined in the `client/src/components/Street.tsx` file.

### To change the street appearance:

1. Open `client/src/components/Street.tsx`
2. Modify the following properties:
   - Street width: Change the size parameters in the plane geometry
   - Street texture: Modify the texture mapping
   - Street length: Adjust the size of the street plane

### To add or remove street objects:

Street objects like lampposts, trees, and other decorations are defined in the `streetObjects` array:

```tsx
const streetObjects: StreetObjectData[] = [
  {
    type: "lamppost",
    position: [5, 0, -30],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  },
  // Add more objects here
];
```

## Modifying Character Movement

Character movement is controlled by the keyboard input system and movement logic.

### To change movement speed:

1. Open `client/src/lib/constants.ts`
2. Locate the `PHYSICS` object
3. Modify the values for `moveSpeed` and `rotationSpeed`:

```tsx
export const PHYSICS = {
  moveSpeed: 5,         // Forward/backward movement speed
  rotationSpeed: 2,     // Left/right rotation speed
  // Other physics settings...
};
```

### To change controls:

1. Open `client/src/hooks/useKeyboard.tsx`
2. Modify the key mappings in the keyboardMap object:

```tsx
const keyboardMap: { [key: string]: string } = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  // Change or add mappings here
};
```

## Changing House Appearance

Houses are defined in the `client/src/components/House.tsx` file.

### To change house design:

1. Open `client/src/components/House.tsx`
2. Modify the mesh components that make up the house

### To change house signs:

1. Open `client/src/components/House.tsx`
2. Find the sign component in the render function
3. Adjust properties like position, scale, or text styling

## Adding New Interactive Objects

To add new interactive objects to the street:

1. Create a new component for your object in `client/src/components/`
2. Add the object to the Street component's render function
3. Implement interaction logic if needed

Example of a new interactive object:

```tsx
// NewObject.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface NewObjectProps {
  position: [number, number, number];
}

const NewObject = ({ position }: NewObjectProps) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      // Add animation or behavior here
      ref.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default NewObject;
```

Then add it to the Street component:

```tsx
import NewObject from './NewObject';

// Inside the Street component render function
return (
  <>
    {/* Existing components */}
    <NewObject position={[5, 0, 10]} />
  </>
);
```

## Adjusting Camera Settings

Camera settings are defined in various places:

1. Open `client/src/components/Experience.tsx`
2. Modify the camera settings in the component

```tsx
// Example camera settings
<PerspectiveCamera 
  makeDefault 
  position={[0, 5, 10]} 
  fov={75} 
  near={0.1} 
  far={1000}
/>
```

## Styling Project Details

Project details popup is defined in `client/src/components/ProjectDetails.tsx`.

### To change the appearance:

1. Open `client/src/components/ProjectDetails.tsx`
2. Modify the JSX structure and Tailwind CSS classes

### To change the layout:

```tsx
// Example of modifying the layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="project-info">
    {/* Project info content */}
  </div>
  <div className="project-image">
    {/* Project image content */}
  </div>
</div>
```

## Advanced Customizations

For more advanced customizations:

### Adding new features:

1. Plan your feature and identify which components it affects
2. Create new components in the appropriate directories
3. Update existing components to use your new feature
4. Add any necessary state management using React hooks or context

### Changing global styles:

1. Open `client/src/index.css`
2. Add or modify Tailwind utility classes or custom CSS

### Adding new animations:

1. Open `client/src/lib/stores/useAnimation.ts`
2. Add new animation states and logic
3. Implement the animations in the relevant components

## Building for Production

When you're ready to deploy your changes:

1. Run the build command:
   ```
   npm run build
   ```

2. The built files will be in the `dist` directory
3. Deploy these files to your web hosting service

## Getting Help

If you encounter issues or need assistance with customizations:

1. Check the React and Three.js documentation
2. Consult the README.md file for an overview of the project
3. Look at existing components for examples and patterns to follow