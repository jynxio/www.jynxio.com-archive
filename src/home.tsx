import { createRoot } from 'react-dom/client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

// FIXME 配置 tsconfig.json 以使其同时支持 React.js 和 Solid.js 的 JSX/TSX 语法。
// FIXME 配置 tsconfig.json 以使其同时支持 React.js 和 Solid.js 的 JSX/TSX 语法。
// FIXME 配置 tsconfig.json 以使其同时支持 React.js 和 Solid.js 的 JSX/TSX 语法。

function Box(props) {
    const meshRef = useRef<Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => (meshRef.current.rotation.x += delta));

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={event => setActive(!active)}
            onPointerOver={event => setHover(true)}
            onPointerOut={event => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

createRoot(document.getElementById('root')!).render(
    <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
    </Canvas>,
);
