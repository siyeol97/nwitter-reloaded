import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';
import { Unsubscribe } from 'firebase/auth';

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export default function Timeline() {

    const [tweets, setTweets] = useState<ITweet[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            // const snapshot = await getDocs(tweetsQuery);
            // const tweets = snapshot.docs.map(doc => {
            //     const { photo, tweet, userId, username, createdAt } = doc.data();
            //     return {
            //         photo,
            //         tweet,
            //         userId,
            //         username,
            //         createdAt,
            //         id: doc.id
            //     }
            // });
            // onSnapshot은 실행되면서 해당 이벤트리스닝의 구독을 해제하는 함수를 반환.
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map(doc => {
                    const { photo, tweet, userId, username, createdAt } = doc.data();
                    return {
                        photo,
                        tweet,
                        userId,
                        username,
                        createdAt,
                        id: doc.id
                    };
                });
                setTweets(tweets);
            });
        };
        fetchTweets();
        return () => { // cleanup
            unsubscribe && unsubscribe();
        }
    }, []);

    return (
        <Wrapper>
            {
                tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))
            }
        </Wrapper>
    )
}