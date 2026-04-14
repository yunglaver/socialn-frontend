import { useState } from "react";
import styles from "./TrackFileStep.module.scss"
import { useEffect } from "react";



export default function TrackFileStep({onChange}) {

    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault();
            console.log("файл над страницей");
        };

        window.addEventListener("dragover", handleDragOver);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
        };
    }, []);

    const [isDragging, setIsDragging] = useState(false);



    return (
            <div
                className={styles.uploadWindowWrapper}
            >
                <label
                    className={styles.uploadWindow}
                >
                    <span>Upload</span>

                    <input
                        type="file"
                        onChange={onChange}
                        className={styles.uploadInput}
                    />
                </label>
            </div>
    );
}



