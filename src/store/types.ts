import { MutationTree, GetterTree } from 'vuex'
import { IControllerKnowledgeAddType } from '../../types/knowledge'

export type State = {
  visibleKnowledge: boolean,
  knowledgeForm: IControllerKnowledgeAddType
}

export type RootState = State

export enum GetterTypes {
  getVisibleKnowledge = 'getVisibleKnowledge',
  getKnowledgeForm = 'getKnowledgeForm'
}
type GetterFuns = {
  [GetterTypes.getVisibleKnowledge] (state: State): boolean;
  [GetterTypes.getKnowledgeForm] (state: State): IControllerKnowledgeAddType;
}
export type Getter = GetterTree<State, RootState> & GetterFuns

export enum MutationTypes {
  setVisibleKnowledge = 'setVisibleKnowledge',
  setKnowledgeForm = 'setKnowledgeForm'
}
type MutationsFuns = {
  [MutationTypes.setVisibleKnowledge] (state: State, value: boolean): void;
  [MutationTypes.setKnowledgeForm] (state: State, value: IControllerKnowledgeAddType): void;
}
export type Mutations = MutationTree<State> & MutationsFuns
