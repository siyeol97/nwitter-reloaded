import styled from "styled-components";
import { ITweet } from "./Timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteBtn = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {

    const user = auth.currentUser;

    const onDelete = async () => {
        const ok = confirm("정말 이 게시물을 삭제하시겠습니까?")
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? <DeleteBtn onClick={onDelete}>Delete</DeleteBtn> : null}
            </Column>
            <Column>
                {photo ? <Photo src={photo} /> : null}
            </Column>
        </Wrapper>
    )
}