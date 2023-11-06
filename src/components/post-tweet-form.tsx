import styled from "styled-components"
import { useState } from "react"
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0
    }
`;
const AttachFileBtn = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;
const AttachFileInput = styled.input`
    display: none;
`;
const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

export default function PostTweetForm() {

    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null)
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            if (files[0].size > 1024 * 1024) {// 1MB 미만인 파일만 업로드
                alert('1MB 미만인 사진만 업로드 됩니다.');
                return;
            } else {
                setFile(files[0]);
            };
        };
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || isLoading || tweet === "" || tweet.length > 180) return;
        try {
            setLoading(true);
            // tweet 업로드
            const doc = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });
            // 사진 파일 업로드
            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`); // 사진 저장 경로
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref) // 사진 URL
                await updateDoc(doc, {
                    photo: url,
                });
                setTweet("");
                setFile(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <Form onSubmit={onSubmit}>
            <TextArea
                required
                rows={5}
                maxLength={180}
                onChange={onChange}
                value={tweet}
                placeholder="What is happening?" />
            <AttachFileBtn htmlFor="file" >
                {file ? "Photo added ✔" : "Add Photo"}
            </AttachFileBtn>
            <AttachFileInput
                onChange={onFileChange}
                type="file"
                id="file"
                accept="image/*" />
            <SubmitBtn
                type="submit"
                value={isLoading ? "Posting ... " : "Post Tweet"} />
        </Form>
    )
}