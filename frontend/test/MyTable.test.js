import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MyTable from 'MyTable/MyTable';

describe('Test MyTable', () => {
  describe('Test getNextDirection()', () => {
    it('should return right next direction', () => {
      const wrapper = shallow(<MyTable />);
      const getNextDirection = wrapper.instance().getNextDirection;
      expect(getNextDirection()).to.equal('asc');
      expect(getNextDirection('asc')).to.equal('desc');
      expect(getNextDirection('desc')).to.equal(undefined);
    })
  })

  describe('Test getNextPriority()', () => {
    it('should return 0 first time', () => {
      const wrapper = shallow(<MyTable />);
      const getNextPriority = wrapper.instance().getNextPriority;
      expect(getNextPriority({})).to.equal(0);
    })

    it('should return next priority', () => {
      const wrapper = shallow(<MyTable />);
      const getNextPriority = wrapper.instance().getNextPriority;
      const sortingPriority = {
        aaa: {
          priority: 1
        },
        bbb: {
          priority: 0
        }
      };
      expect(getNextPriority(sortingPriority)).to.equal(2);
    })
  })

  describe('Test getPrioritisedSortingColumnKeys()', () => {
    it('should prioritise sorting columns', () => {
      const wrapper = shallow(<MyTable />);
      const getPrioritisedSortingColumnKeys = wrapper.instance().getPrioritisedSortingColumnKeys;
      const sortingColumns = {
        'aaaa': {
          priority: 1
        },
        'bbbb': {
          priority: 2
        },
        'cccc': {
          priority: 0
        }
      };
      expect(getPrioritisedSortingColumnKeys(sortingColumns)).to.deep.equal([
        'cccc', 'aaaa', 'bbbb'
      ])
    })
  })


  describe('Test sortByProperty', () => {
    it('should sort by property', () => {
      const wrapper = shallow(<MyTable />);
      const sortByProperty = wrapper.instance().sortByProperty;

      const rows = [
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 },
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 }
      ];

      expect(sortByProperty(rows, 'score', 'asc')).to.deep.equal([
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 },
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 }
      ]);
      
      expect(sortByProperty(rows, 'score', 'desc')).to.deep.equal([
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 },
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 }
      ]);

    })
  })

  describe('Test getSortedRows()', () => {
    it('should sort single columns', () => {
      const wrapper = shallow(<MyTable />);
      const getSortedRows = wrapper.instance().getSortedRows;
      const rows = [
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 },
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 }
      ];
      const sortingColumns = {
        'score': {
          priority: 0,
          direction: 'asc'
        }
      };
      expect(getSortedRows(rows, sortingColumns)).to.deep.equal([
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 },
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 }
      ])
    })

    it('should sort multiple columns', () => {
      const wrapper = shallow(<MyTable />);
      const getSortedRows = wrapper.instance().getSortedRows;
      const rows = [
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 },
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 }
      ];
      const sortingColumns = {
        'score': {
          priority: 0,
          direction: 'asc'
        },
        'city': {
          priority: 1,
          direction: 'asc'
        }
      };
      expect(getSortedRows(rows, sortingColumns)).to.deep.equal([
        { id: 5, name: 'abraham', family: 'blue', city: 'darwin', score: 500 },
        { id: 4, name: 'simon', family: 'long', city: 'perth', score: 400 },
        { id: 2, name: 'peter', family: 'street', city: 'sydney', score: 200 },
        { id: 3, name: 'joe', family: 'larson', city: 'sydney', score: 300 },
        { id: 1, name: 'jack', family: 'hanson', city: 'sydney', score: 600 }
      ])
    })
  })

});