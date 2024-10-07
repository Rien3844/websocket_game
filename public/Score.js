import { sendEvent } from './Socket.js';
import { Data } from './Assets.js'

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  
// 게임 에셋에서 다음 에셋의 존재 여부 확인

  update(deltaTime){
    //스테이지별 점수획득
    this.score += deltaTime*0.001*Data.stage.data[this.currentStage].scorePerSecond;
    //스테이지 이동
    if (Math.floor(this.score) === Data.stage.data[this.currentStage + 1].score && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, 
        { currentStage: Data.stage.data[this.currentStage].id,
          targetStage: Data.stage.data[this.currentStage + 1].id 
        });
        this.currentStage++;
    }
  }

  getItem(itemId) {
    // 아이템 획득시 점수 변화
    const itemidindex = Data.item.data.find((item) => item.id === itemId);
    this.score += itemidindex.score;

    sendEvent(12, {itemId: itemId, itemScore: itemidindex.score});
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;