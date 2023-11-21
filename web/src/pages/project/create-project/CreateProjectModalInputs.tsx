import { useRef } from "react";

interface CreateProjectModalInputsProps {
    state: CreateProjectModalInputsState;
    setState: (state: CreateProjectModalInputsState) => void;
}

export interface CreateProjectModalInputsState {
    name: string;
    description: string;
    image?: File;
}

const allowedTypes = ['image/png', 'image/jpg'];

function CreateProjectModalInputs({ state, setState }: CreateProjectModalInputsProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleStateChange = (key: keyof CreateProjectModalInputsState, value: string | null | File) => {
        const updatedState = { ...state, [key]: value };
        setState(updatedState);
    }

    const handleFile = (file: File | null) => {
        if (!file || !allowedTypes.some((t) => t === file.type)) {
            return;
        }
        handleStateChange('image', file);
        return;

        // const reader = new FileReader();
        // reader.addEventListener("load", () => {
        //     if (typeof reader.result === 'string')
        //         handleStateChange('image', reader.result);
        // });
        // reader.readAsDataURL(file);
    }

    const uploadedImageHtml = state.image ? <img src={state.image.webkitRelativePath}/> : <img src='/empty.jpg'/>;

    return (
        <>
            <div>
                <div className='create-project-modal-box'>
                    <input placeholder='Name' autoComplete="o" required value={state.name} onChange={(e) => handleStateChange('name', e.target.value)} />
                    <input placeholder='Description' autoComplete="o" required value={state.description} onChange={(e) => handleStateChange('description', e.target.value)} />
                </div>
            </div>
            <div onClick={() => fileInputRef.current?.click()}>
                <input type="file" accept='.png,.jpg' ref={fileInputRef} hidden required onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                {uploadedImageHtml}
            </div>
        </>
    )
}

export default CreateProjectModalInputs;