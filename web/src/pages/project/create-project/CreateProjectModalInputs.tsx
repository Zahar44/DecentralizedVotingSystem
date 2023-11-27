import { useRef } from "react";

interface CreateProjectModalInputsProps {
    state: CreateProjectModalInputsState;
    setState: (state: CreateProjectModalInputsState) => void;
}

export interface CreateProjectModalInputsState {
    name: string;
    description: string;
    image?: File;
    imageData?: string;
}

const allowedTypes = ['image/png', 'image/jpeg'];

function CreateProjectModalInputs({ state, setState }: CreateProjectModalInputsProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (file: File | null) => {
        if (!file || !allowedTypes.some((t) => t === file.type)) {
            return;
        }
        const updatedState: Partial<CreateProjectModalInputsState> = {};
        updatedState.image = file;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result === 'string') {
                updatedState.imageData = reader.result;
            }
            setState({
                ...state,
                ...updatedState,
            });
        });
        reader.readAsDataURL(file);
    }

    const uploadedImageHtml = state.imageData ? <img src={state.imageData}/> : <img src='/empty.jpg'/>;

    return (
        <>
            <div>
                <div className='create-project-modal-box'>
                    <input placeholder='Name' autoComplete="o" required value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
                    <textarea placeholder='Description' autoComplete="o" required value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} />
                </div>
            </div>
            <div className='create-project-modal-box' onClick={() => fileInputRef.current?.click()}>
                <input type="file" accept='.png,.jpg' ref={fileInputRef} hidden required onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                {uploadedImageHtml}
            </div>
        </>
    )
}

export default CreateProjectModalInputs;