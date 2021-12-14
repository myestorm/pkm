import { MutationTree, GetterTree } from 'vuex'
import { IKnowledgeType } from '../../app/types/knowledge'

export type State = {
  visibleKnowledge: boolean,
  knowledgeForm: IKnowledgeType
}

export type RootState = State

export enum GetterTypes {
  getVisibleKnowledge = 'getVisibleKnowledge',
  getKnowledgeForm = 'getKnowledgeForm'
}
type GetterFuns = {
  [GetterTypes.getVisibleKnowledge] (state: State): boolean;
  [GetterTypes.getKnowledgeForm] (state: State): IKnowledgeType;
}
export type Getter = GetterTree<State, RootState> & GetterFuns

export enum MutationTypes {
  setVisibleKnowledge = 'setVisibleKnowledge',
  setKnowledgeForm = 'setKnowledgeForm'
}
type MutationsFuns = {
  [MutationTypes.setVisibleKnowledge] (state: State, value: boolean): void;
  [MutationTypes.setKnowledgeForm] (state: State, value: IKnowledgeType): void;
}
export type Mutations = MutationTree<State> & MutationsFuns
