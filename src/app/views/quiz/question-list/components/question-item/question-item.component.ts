import {Component, Input, OnInit} from '@angular/core';
import {Question} from '../../../../../models/quiz/question.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionListService} from '../../question-list.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Answer} from '../../../../../models/quiz/answer.model';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.styl']
})
export class QuestionItemComponent implements OnInit {
  id: number;
  editMode = false;
  questionForm = FormGroup;

  constructor(
    private questionListService: QuestionListService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.questionListService.updateQuestion(this.id, this.questionForm.value);
    } else {
      this.questionListService.addQuestion(this.questionForm.value);
    }

    this.router.navigate(['../'], {relativeTo: this.route});

    this.onCancel();
  }

  onAddAnswer() {
    (<FormArray>this.questionForm.get('answers')).push(
      new FormGroup({
        'text': new FormControl(
          null,
          Validators.required
        ),
        'correct': new FormControl(
          null,
          [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]
        )
      })
    );
  }

  onDeleteAnswer(index: number) {
    (<FormArray>this.questionForm.get('answers')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {
    let questionText = '';
    let questionHint = '';
    let answers = new FormArray([]);

    if (this.editMode) {
      const question: Question = this.questionListService.getQuestion(this.id);

      questionText = question.question;
      questionHint = question.hint;

      if (question['answers']) {
        for (let answer: Answer of question.answers) {
          answers.push(
            new FormGroup({
              'text': new FormControl(answer.text, Validators.required),
              'correct': new FormControl(answer.isCorrect, Validators.required)
            })
          );
        }
      }
    }

    this.questionForm = new FormGroup(
      {
        'question': new FormControl(questionText, Validators.required),
        'hint': new FormControl(questionHint),
        'answers': answers
      }
    );
  }
}
