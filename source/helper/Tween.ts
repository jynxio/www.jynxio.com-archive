type EventTypes = "begin" | "update" | "end";
type EventHandler<T extends EventTypes> = T extends "begin" | "end"
	? () => void
	: ( percentage: number ) => void;

class Tween {

	private clock = 0; // Unit: ms

	private timestamp = 0; // Unit: ms

	private duration = 0; // Unit: ms

	private isRunning = false;

	private beginEvents = new Set<EventHandler<"begin">>();

	private updateEvents = new Set<EventHandler<"update">>();

	private endEvents = new Set<EventHandler<"end">>();

	play () {

		const that = this;

		that.isRunning = true;
		that.clock = performance.now();
		that.timestamp === 0 && Array.from( that.updateEvents.values() ).forEach( event => event( 0 ) );
		requestAnimationFrame( function loop ( timestamp ) {

			if ( ! that.isRunning ) return;

			if ( that.timestamp > that.duration ) {

				Array.from( that.endEvents.values() ).forEach( event => event() );
				that.reset();

				return;

			}

			that.timestamp += timestamp - that.clock;
			that.clock = timestamp;

			const percentage = that.timestamp / that.duration;
			for ( const event of that.updateEvents.values() ) event( percentage );

			requestAnimationFrame( loop );

		} );

		return that;

	}

	pause () {

		this.isRunning = false;

		return this;

	}

	reset () {

		this.isRunning = false;
		this.timestamp = 0;

		return this;

	}

	setDuration ( time: number ) {

		this.duration = time;

		return this;

	}

	addEventListener <T extends EventTypes> ( type: T, event: EventHandler<T> ) {

		switch ( type ) {

		case "begin":
			this.beginEvents.add( event as EventHandler<"begin"> ); // TODO 类型写错了？
			break;

		case "update":
			this.updateEvents.add( event );
			break;

		case "end":
			this.endEvents.add( event as EventHandler<"end"> );    // TODO 类型写错了？
			break;

		default:
			throw new Error( "Unknow event type" );

		}

		return this;

	}

	removeEventListener <T extends EventTypes> ( type: T, event: EventHandler<T> ) {

		switch ( type ) {

		case "begin":
			this.beginEvents.delete( event as EventHandler<"begin"> ); // TODO 类型写错了？
			break;

		case "update":
			this.updateEvents.delete( event );
			break;

		case "end":
			this.endEvents.delete( event as EventHandler<"end"> );     // TODO 类型写错了？
			break;

		default:
			throw new Error( "Unknow event type" );

		}

		return this;

	}

}

export default Tween;
