import {
  ATTACK,
  CARRY,
  ERR_NOT_IN_RANGE,
  MOVE,
  RESOURCE_ENERGY,
  WORK,
} from "game/constants";
import { getGameObjects, hasBodyType } from "./util";

export function loop(): void {
  const { my, enemy, containers } = getGameObjects();
  const hasAttackPart = hasBodyType.bind(null, ATTACK);
  const attackers = my.creeps.filter(hasAttackPart);
  if (attackers.length === 0) {
    my.spawns[0].spawnCreep([MOVE, ATTACK]).object;
  } else {
    my.spawns[0].spawnCreep([MOVE, WORK, CARRY]).object;
  }
  const workers = my.creeps.filter(hasBodyType.bind(null, WORK));
  for (const worker of workers) {
    if (worker.store[RESOURCE_ENERGY] === 0) {
      const container = worker.findClosestByPath(containers);
      if (!container) {
        continue;
      }
      if (worker.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        worker.moveTo(container);
      }
    } else {
      if (worker.transfer(my.spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        worker.moveTo(my.spawns[0]);
      }
    }
  }

  if (enemy.spawns[0]) {
    for (const attacker of attackers) {
      attacker.moveTo(enemy.spawns[0]);
      attacker.attack(enemy.spawns[0]);
    }
  }
}
