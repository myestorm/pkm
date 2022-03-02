import { MutationTree, GetterTree } from 'vuex'
import { IControllerKnowledgeAddType } from '../../types/knowledge'

export type State = {
  system: {
    userAgent: string,
    isMobile: boolean
  },
  mobile: {
    current: number
  },
  visibleKnowledge: boolean,
  knowledgeForm: IControllerKnowledgeAddType
}

export type RootState = State

export enum GetterTypes {
  getVisibleKnowledge = 'getVisibleKnowledge',
  getKnowledgeForm = 'getKnowledgeForm',
  getUserAgent = 'getUserAgent',
  getIsMobile = 'getIsMobile',
  getMobileCurrent = 'getMobileCurrent',
}
type GetterFuns = {
  [GetterTypes.getVisibleKnowledge] (state: State): boolean;
  [GetterTypes.getKnowledgeForm] (state: State): IControllerKnowledgeAddType;
  [GetterTypes.getUserAgent] (state: State): string;
  [GetterTypes.getIsMobile] (state: State): boolean;
  [GetterTypes.getMobileCurrent] (state: State): number;
}
export type Getter = GetterTree<State, RootState> & GetterFuns

export enum MutationTypes {
  setVisibleKnowledge = 'setVisibleKnowledge',
  setKnowledgeForm = 'setKnowledgeForm',
  setMobileCurrent = 'setMobileCurrent',
}
type MutationsFuns = {
  [MutationTypes.setVisibleKnowledge] (state: State, value: boolean): void;
  [MutationTypes.setKnowledgeForm] (state: State, value: IControllerKnowledgeAddType): void;
  [MutationTypes.setMobileCurrent] (state: State, value: number): void;
}
export type Mutations = MutationTree<State> & MutationsFuns
