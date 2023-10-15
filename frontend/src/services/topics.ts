import authorizedAxios from "src/utils/axios/authorizedAxios";
import { BE_API } from "src/utils/api";
import { TopicsResponse } from "@/@types/topic";

export const getTopics = () => authorizedAxios.get<TopicsResponse>(BE_API.topics);
