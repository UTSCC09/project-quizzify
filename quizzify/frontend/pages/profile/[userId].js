import {
  useEffect, useState,
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as USER_API from "@/api/users";

import { useRouter } from "next/router";
import Profile from ".";

export default function ProfileActual() {
  const {
    getAccessTokenSilently,
  } = useAuth0();

  const router = useRouter()
  const userId = router.query.userId

  const [selectedUser, setSelectedUser] = useState({})
  useEffect(() => {
    const getUser = async (userId) => {
        const accessToken = await getAccessTokenSilently();
        const response = await USER_API.getUserById(accessToken, userId)
        if (response[0].status == 200 && response.length > 1) {
            setSelectedUser(response[1])
        } else
            console.log("Failed to get user")
    }
    if (userId) getUser(userId)
}, [router.query.userId])

  return <Profile selectedUser={selectedUser}/>
}