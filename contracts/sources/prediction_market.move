/// Invisible DEX – Prediction market logic for hybrid settlement.
/// Markets are created on-chain; micro-bets can be batched and settled via PTBs.
module invisible_dex::prediction_market {

    use std::string::{String, utf8};
    use sui::balance::{Balance, join, split, value, zero};
    use sui::coin::{Coin, from_balance, into_balance, value as coin_value};
    use sui::object::{self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{sender, TxContext};
    use sui::event;

    // ============== Errors ==============

    const EMarketNotResolved: u64 = 1;
    const EMarketAlreadyResolved: u64 = 2;
    const ENotMarketCreator: u64 = 3;
    const EInvalidOutcome: u64 = 4;
    const ENoWinningPosition: u64 = 5;
    const EAlreadyClaimed: u64 = 6;
    const EZeroAmount: u64 = 7;

    // ============== Constants ==============

    const OUTCOME_YES: u8 = 0;
    const OUTCOME_NO: u8 = 1;

    // ============== Structs ==============

    /// Shared market: anyone can place bets; only creator can resolve.
    struct PredictionMarket<phantom T> has key, store {
        id: UID,
        question: String,
        creator: address,
        resolved: bool,
        winning_outcome: u8,
        pool_yes: Balance<T>,
        pool_no: Balance<T>,
    }

    /// A user's position in a market. Transfer to user; they use it to claim if they win.
    struct Position<phantom T> has key, store {
        id: UID,
        market_id: ID,
        outcome: u8,
        amount: Balance<T>,
    }

    // ============== Events ==============

    struct MarketCreated<phantom T> has copy, drop, store {
        market_id: ID,
        question: String,
        creator: address,
    }

    struct BetPlaced<phantom T> has copy, drop, store {
        market_id: ID,
        better: address,
        outcome: u8,
        amount: u64,
    }

    struct MarketResolved<phantom T> has copy, drop, store {
        market_id: ID,
        winning_outcome: u8,
    }

    struct Claimed<phantom T> has copy, drop, store {
        market_id: ID,
        claimer: address,
        amount: u64,
    }

    // ============== Public / entry APIs ==============

    /// Create a new prediction market (programmatic). Prefer create_and_share_market for one-shot.
    public fun create_market<T>(
        question: vector<u8>,
        ctx: &mut TxContext
    ): PredictionMarket<T> {
        let question_str = utf8(question);
        let market = PredictionMarket<T> {
            id: object::new(ctx),
            question: question_str,
            creator: sender(ctx),
            resolved: false,
            winning_outcome: OUTCOME_YES,
            pool_yes: zero(),
            pool_no: zero(),
        };
        let market_id = object::id(&market);
        event::emit(MarketCreated<T> {
            market_id,
            question: question_str,
            creator: sender(ctx),
        });
        market
    }

    /// Create and share a market so anyone can place bets.
    public entry fun create_and_share_market<T>(
        question: vector<u8>,
        ctx: &mut TxContext
    ) {
        let market = create_market<T>(question, ctx);
        transfer::share_object(market);
    }

    /// Place a bet on YES (0) or NO (1). Caller receives a Position object to claim later if they win.
    public fun place_bet<T>(
        market: &mut PredictionMarket<T>,
        coin: Coin<T>,
        outcome: u8,
        ctx: &mut TxContext
    ): Position<T> {
        assert!(outcome == OUTCOME_YES || outcome == OUTCOME_NO, EInvalidOutcome);
        assert!(!market.resolved, EMarketAlreadyResolved);
        let amount = coin_value(&coin);
        assert!(amount > 0, EZeroAmount);

        let balance = into_balance(coin);
        if (outcome == OUTCOME_YES) {
            join(&mut market.pool_yes, balance);
        } else {
            join(&mut market.pool_no, balance);
        };

        let pool = if (outcome == OUTCOME_YES) { &mut market.pool_yes } else { &mut market.pool_no };
        let position_balance = split(pool, amount);

        let position = Position<T> {
            id: object::new(ctx),
            market_id: object::id(market),
            outcome,
            amount: position_balance,
        };

        event::emit(BetPlaced<T> {
            market_id: object::id(market),
            better: sender(ctx),
            outcome,
            amount,
        });

        position
    }

    /// Resolve the market. Only the creator can resolve. winning_outcome: 0 = YES, 1 = NO.
    public entry fun resolve<T>(
        market: &mut PredictionMarket<T>,
        winning_outcome: u8,
        _ctx: &TxContext
    ) {
        assert!(sender(_ctx) == market.creator, ENotMarketCreator);
        assert!(!market.resolved, EMarketAlreadyResolved);
        assert!(winning_outcome == OUTCOME_YES || winning_outcome == OUTCOME_NO, EInvalidOutcome);

        market.resolved = true;
        market.winning_outcome = winning_outcome;

        event::emit(MarketResolved<T> {
            market_id: object::id(market),
            winning_outcome,
        });
    }

    /// Claim winnings for a winning position. Consumes the Position and transfers the coin to sender.
    public fun claim<T>(
        market: &PredictionMarket<T>,
        position: Position<T>,
        ctx: &mut TxContext
    ) {
        assert!(market.resolved, EMarketNotResolved);
        assert!(object::id(market) == position.market_id, EInvalidOutcome);
        assert!(position.outcome == market.winning_outcome, ENoWinningPosition);

        let Position { id, market_id, amount, .. } = position;
        let amount_val = value(&amount);
        let coin = from_balance(amount);
        transfer::public_transfer(coin, sender(ctx));

        event::emit(Claimed<T> {
            market_id,
            claimer: sender(ctx),
            amount: amount_val,
        });

        object::delete(id);
    }
}
