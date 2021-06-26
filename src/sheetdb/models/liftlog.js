const SheetDB = require('../sheetdb');
const T = SheetDB.Types;
const M = SheetDB.Methods;

const LiftLogModel = SheetDB.Model('liftlog')
    .Column('date', T.Date)
    .Column('person', T.String)
    .Column('lift', T.String)
    .Column('weight', T.Float)
    .Column('reps', T.Int)
    .Column('rest', T.Int)
;
// Database.From('liftlog').Select(['date', 'person', 'lift']).Limit(5).Offset(3).Query()
// Database.From('liftlog').Index('repmax').Select('onerepmax').Where({person: 'Matt', lift: 'Bench Press'}).Limit(1).Query()

LiftLogModel
    .Index('latestLifts')
    .Filter('lift')
    .Filter('date')
    .Filter('person')
    .Sort('date', 'desc')
;

LiftLogModel
    .Index('volume')
    .Group('date')
    .Group('lift')
    .Group('person')
    .Computed('volume', M.Sum(M.Mul('weight', 'reps')))
    .Filter('lift')
    .Filter('date')
    .Filter('person')
    .Sort('date', 'desc')
;

LiftLogModel
    .Index('repmax')
    .Group('lift')
    .Group('person')
    .Computed('onerepmax',
        M.Round(M.Max(
            M.Cond(
                M.Greater('reps', 10),
                M.Mul(
                    'weight',
                    M.Add(1, M.Div('reps', 30))
                ),
                M.Mul(
                    'weight',
                    M.Div(36, M.Sub(37, 'reps'))
                ),
            )
        ))
    )
    .Filter('lift')
    .Filter('person')
    .Sort('person', 'asc')
    .Sort('lift', 'asc')
;

module.exports = LiftLogModel;
