import { getObjectsByPrototype } from "game/utils";
import {
  _Constructor,
  Creep,
  StructureContainer,
  StructureSpawn,
} from "game/prototypes";

const divideByTeam = <T extends { my: boolean }>(
  prototype: _Constructor<T>
): [T[], T[]] => {
  const myObjects = getObjectsByPrototype(prototype).filter((i) => i.my);
  const enemyObjects = getObjectsByPrototype(prototype).filter((i) => !i.my);
  return [myObjects, enemyObjects];
};

export const getGameObjects = () => {
  const [mySpawns, enemySpawns] = divideByTeam(StructureSpawn);
  const containers = getObjectsByPrototype(StructureContainer);
  const [myCreeps, enemyCreeps] = divideByTeam(Creep);
  return {
    containers,
    my: {
      creeps: myCreeps,
      spawns: mySpawns,
    },
    enemy: {
      creeps: enemyCreeps,
      spawns: enemySpawns,
    },
  };
};

export const hasBodyType = (bodyType: string, creep: Creep) => {
  return creep.body.some((body) => body.type === bodyType);
};
