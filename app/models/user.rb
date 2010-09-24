class User < ActiveRecord::Base

  def as_json(options=nil)
    {
      :id          => facebook_id,
      :best_streak => best_streak,
      :score       => score,
      :high_score  => high_score,
      :updated_at  => updated_at,
    }
  end

  before_save :update_high_score

  private

  def update_high_score
    self.high_score = self.score if self.score > self.high_score
  end

end
