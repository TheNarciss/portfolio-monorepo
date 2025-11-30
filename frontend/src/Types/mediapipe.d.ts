// src/types/mediapipe.d.ts (UPDATED)

declare module '@mediapipe/face_mesh' {
    export class FaceMesh {
        constructor(options: any);
        setOptions(options: any): void;
        onResults(callback: (results: any) => void): void;
        send(options: { image: any }): Promise<void>;
        close(): void;
        // 💡 FIX 2339: Added static properties to the class declaration
        static FACEMESH_TESSELATION: any; 
        static FACEMESH_CONTOURS: any;
        static FACEMESH_RIGHT_EYE: any; // Optional: include other useful constants
        static FACEMESH_LEFT_EYE: any;
        static FACEMESH_OVAL: any;
    }
    // ... other exports remain the same ...
}

// ... other module declarations remain the same ...