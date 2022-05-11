const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      it('короче минимума', () => {
        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('длиннее максимума', () => {
        const errors = validator.validate({ name: 'LalalaLalalaLalalaLalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
      });

      it('валидные данные', () => {
        const errors = validator.validate({ name: 'LalalaLalala' });

        expect(errors).to.have.length(0);
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 99,
        },
      });

      it('меньше минимума', () => {
        const errors = validator.validate({ age: 17 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
      });

      it('больше максимума', () => {
        const errors = validator.validate({ age: 107 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 99, got 107');
      });

      it('валидные данные', () => {
        const errors = validator.validate({ age: 30 });

        expect(errors).to.have.length(0);
      });
    });

    it('поле неправильного типа', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 99,
        },
      });

      const errors = validator.validate({ age: '17' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
  });
});