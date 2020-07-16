class RecordsController < ApplicationController

  def index
    @record = Record.find_by(user_id: current_user.id)
    if @record
      @time = @record.time
      @time_min = (@time / 100 / 60).floor
    end
  end

  def create
    user_record = Record.find_by(user_id: current_user.id)
    if user_record
      @time = user_record.update(time: user_record.time + params[:time])
    else
      @time = Record.create(record_params)
    end
    respond_to do |format|
      format.json { render json: @time}
    end
  end

  private
  def record_params
    params.require(:record).permit(:time).merge(user_id: current_user.id)
  end

end
