import { MutationTree, GetterTree } from 'vuex'
import { IKnowledgeType } from '../../app/types/knowledge'

export type State = {
  visibleKnowledge: boolean,
  knowledgeForm: IKnowledgeType
  visibleSelectKnowledge: boolean
}

export type RootState = State

export enum GetterTypes {
  getVisibleKnowledge = 'getVisibleKnowledge',
  getKnowledgeForm = 'getKnowledgeForm',
  getVisibleSelectKnowledge = 'getVisibleSelectKnowledge'
}
type GetterFuns = {
  [GetterTypes.getVisibleKnowledge] (state: State): boolean;
  [GetterTypes.getKnowledgeForm] (state: State): IKnowledgeType;
  [GetterTypes.getVisibleSelectKnowledge] (state: State): boolean;
}
export type Getter = GetterTree<State, RootState> & GetterFuns

export enum MutationTypes {
  setVisibleKnowledge = 'setVisibleKnowledge',
  setKnowledgeForm = 'setKnowledgeForm',
  setVisibleSelectKnowledge = 'setVisibleSelectKnowledge'
}
type MutationsFuns = {
  [MutationTypes.setVisibleKnowledge] (state: State, value: boolean): void;
  [MutationTypes.setKnowledgeForm] (state: State, value: IKnowledgeType): void;
  [MutationTypes.setVisibleSelectKnowledge] (state: State, value: boolean): void;
}
export type Mutations = MutationTree<State> & MutationsFuns
